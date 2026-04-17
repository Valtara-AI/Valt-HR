// pages/api/candidates/[id]/score.ts - Get or calculate candidate score with full provenance
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/db';
import { candidateScoringQueue } from '../../../../lib/queue';
import { EnhancedScoringResult, EnhancedScoringService } from '../../../../lib/services/scoring-engine.service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const candidateId = String(id);

  // GET: Retrieve existing scores with full breakdown
  if (req.method === 'GET') {
    try {
      const applications = await prisma.application.findMany({
        where: { candidateId },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              department: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (applications.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'No applications found for this candidate',
        });
      }

      // Get audit history for this candidate
      let auditHistory: any[] = [];
      try {
        auditHistory = await prisma.scoreAuditLog.findMany({
          where: { candidateId },
          orderBy: { createdAt: 'desc' },
          take: 20,
        });
      } catch (e) {
        // Table may not exist yet
      }

      // Calculate average score and return all scores
      const scores = applications.map(app => {
        const scoringDetails = app.scoringDetails as EnhancedScoringResult | null;
        return {
          applicationId: app.id,
          jobId: app.jobId,
          jobTitle: app.job.title,
          resumeScore: app.resumeScore || 0,
          breakdown: {
            skills: {
              score: app.skillsScore || scoringDetails?.breakdown?.skills?.score || 0,
              weight: 40,
              weightedScore: ((app.skillsScore || 0) * 40) / 100,
              matchedSkills: scoringDetails?.breakdown?.skills?.matchedSkills || [],
              missingSkills: scoringDetails?.breakdown?.skills?.missingSkills || [],
              synonymMatches: scoringDetails?.breakdown?.skills?.synonymMatches || [],
              explanation: scoringDetails?.breakdown?.skills?.explanation || 'No details available',
            },
            experience: {
              score: app.experienceScore || scoringDetails?.breakdown?.experience?.score || 0,
              weight: 30,
              weightedScore: ((app.experienceScore || 0) * 30) / 100,
              totalYears: scoringDetails?.breakdown?.experience?.totalYears || 0,
              requiredYears: scoringDetails?.breakdown?.experience?.requiredYears || 0,
              explanation: scoringDetails?.breakdown?.experience?.explanation || 'No details available',
            },
            education: {
              score: app.educationScore || scoringDetails?.breakdown?.education?.score || 0,
              weight: 20,
              weightedScore: ((app.educationScore || 0) * 20) / 100,
              highestDegree: scoringDetails?.breakdown?.education?.highestDegree || 'Unknown',
              normalizedLevel: scoringDetails?.breakdown?.education?.normalizedLevel || 'unknown',
              explanation: scoringDetails?.breakdown?.education?.explanation || 'No details available',
            },
            other: {
              score: app.otherScore || scoringDetails?.breakdown?.other?.score || 0,
              weight: 10,
              weightedScore: ((app.otherScore || 0) * 10) / 100,
              factors: scoringDetails?.breakdown?.other?.factors || [],
              explanation: scoringDetails?.breakdown?.other?.explanation || 'No details available',
            },
          },
          category: {
            level: app.scoreCategory || EnhancedScoringService.getScoreCategory(app.resumeScore || 0).category,
            description: EnhancedScoringService.getScoreCategory(app.resumeScore || 0).description,
          },
          redFlags: scoringDetails?.redFlags || [],
          provenance: scoringDetails?.provenance || {
            algorithmVersion: app.scoringVersion || 'legacy',
            scoredAt: app.scoredAt || app.updatedAt,
            scoredBy: app.scoredBy || 'system',
            isOverridden: false,
          },
          confidence: scoringDetails?.confidence || 50,
          recommendations: scoringDetails?.recommendations || [],
          scoredAt: app.scoredAt || app.updatedAt,
        };
      });

      const averageScore = Math.round(
        scores.reduce((sum, s) => sum + s.resumeScore, 0) / scores.length
      );

      return res.status(200).json({
        success: true,
        data: {
          candidateId,
          averageScore,
          category: EnhancedScoringService.getScoreCategory(averageScore),
          scores,
          auditHistory: auditHistory.map(log => ({
            id: log.id,
            action: log.action,
            previousScore: log.previousScore,
            newScore: log.newScore,
            actorType: log.actorType,
            actorName: log.actorName,
            reason: log.reason,
            createdAt: log.createdAt,
          })),
        },
      });
    } catch (error) {
      console.error('Get candidate score error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch candidate scores',
      });
    }
  }

  // POST: Trigger manual scoring for a specific job
  if (req.method === 'POST') {
    const { jobId, overrideScore, overrideReason, overriddenBy } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        error: 'Job ID is required',
      });
    }

    try {
      // Check if candidate exists
      const candidate = await prisma.candidate.findUnique({
        where: { id: candidateId },
      });

      if (!candidate) {
        return res.status(404).json({
          success: false,
          error: 'Candidate not found',
        });
      }

      // Check if application exists
      const application = await prisma.application.findFirst({
        where: {
          candidateId,
          jobId: String(jobId),
        },
      });

      if (!application) {
        return res.status(404).json({
          success: false,
          error: 'Application not found for this candidate and job',
        });
      }

      // Get job requirements
      const job = await prisma.job.findUnique({
        where: { id: String(jobId) },
      });

      if (!job) {
        return res.status(404).json({
          success: false,
          error: 'Job not found',
        });
      }

      // Parse job requirements from JSON
      const jobReqs = job.requirements as any || {};
      const jobRequirements = {
        requiredSkills: (jobReqs.skills || jobReqs.requiredSkills || []) as string[],
        preferredSkills: (jobReqs.preferredSkills || []) as string[],
        minExperience: jobReqs.experience?.minYears || jobReqs.minExperience || 0,
        maxExperience: jobReqs.experience?.maxYears || jobReqs.maxExperience,
        education: {
          degreeLevel: jobReqs.education?.level || jobReqs.minEducation,
          preferredFields: jobReqs.education?.fields || [],
        },
        certifications: jobReqs.certifications || [],
      };

      // Get parsed resume data
      const parsedData = candidate.resumeParsedData as any || {
        personalInfo: { 
          email: candidate.email, 
          phone: candidate.phone,
          linkedinUrl: candidate.linkedinUrl,
        },
        skills: candidate.skills || [],
        experience: candidate.experience || [],
        education: candidate.education || [],
        summary: '',
      };

      // Store previous score for audit
      const previousScore = application.resumeScore;

      // Calculate score using enhanced scoring engine
      const scoringResult = await EnhancedScoringService.scoreResume(
        parsedData,
        jobRequirements,
        {}, // Use default weights
        {
          scoredBy: overriddenBy || 'SYSTEM',
          applicationId: application.id,
          includeRecommendations: true,
        }
      );

      // Handle manual override if provided
      let finalResult = scoringResult;
      if (overrideScore !== undefined && overrideReason) {
        finalResult = EnhancedScoringService.overrideScore(
          scoringResult,
          overrideScore,
          overriddenBy || 'admin',
          overrideReason
        );
      }

      // Update application with score and detailed breakdown
      await prisma.application.update({
        where: { id: application.id },
        data: {
          resumeScore: finalResult.resumeScore,
          skillsScore: finalResult.breakdown.skills.score,
          experienceScore: finalResult.breakdown.experience.score,
          educationScore: finalResult.breakdown.education.score,
          otherScore: finalResult.breakdown.other.score,
          scoringDetails: finalResult as any,
          scoringVersion: finalResult.provenance.algorithmVersion,
          scoredAt: new Date(),
          scoredBy: overriddenBy || 'system',
          scoreCategory: finalResult.category.level,
          redFlags: finalResult.redFlags as any,
          redFlagCount: finalResult.redFlags.length,
          overallScore: finalResult.resumeScore,
          stage: finalResult.resumeScore >= 60 ? 'screening' : 'rejected',
          lastProgressAt: new Date(),
        },
      });

      // Create audit log entry
      try {
        await prisma.scoreAuditLog.create({
          data: {
            candidateId,
            applicationId: application.id,
            jobId: String(jobId),
            previousScore: previousScore || null,
            newScore: finalResult.resumeScore,
            scoreChange: previousScore ? finalResult.resumeScore - previousScore : null,
            previousBreakdown: application.scoringDetails as any || null,
            newBreakdown: {
              skills: finalResult.breakdown.skills.score,
              experience: finalResult.breakdown.experience.score,
              education: finalResult.breakdown.education.score,
              other: finalResult.breakdown.other.score,
            },
            actorType: overrideScore !== undefined ? 'admin' : 'system',
            actorId: overriddenBy || null,
            actorName: overriddenBy || 'Scoring Engine',
            action: overrideScore !== undefined ? 'manual-override' : 'auto-score',
            reason: overrideReason || 'Automated scoring via API',
            scoringVersion: finalResult.provenance.algorithmVersion,
            dataSourcesUsed: ['resume', 'job-requirements'],
            algorithmDetails: {
              weights: { skills: 40, experience: 30, education: 20, other: 10 },
              fuzzyMatchingEnabled: true,
              synonymMatchingEnabled: true,
            },
            explanation: {
              skills: finalResult.breakdown.skills.explanation,
              experience: finalResult.breakdown.experience.explanation,
              education: finalResult.breakdown.education.explanation,
              other: finalResult.breakdown.other.explanation,
            },
          },
        });
      } catch (auditError) {
        console.warn('Failed to create audit log (table may not exist):', auditError);
      }

      // Queue for background validation (social media, background check)
      try {
        await candidateScoringQueue.add('score-candidate', {
          applicationId: application.id,
          candidateId,
          jobId: String(jobId),
          triggerEnrichment: true,
        });
      } catch (queueError) {
        console.warn('Failed to queue background validation:', queueError);
      }

      return res.status(200).json({
        success: true,
        message: overrideScore !== undefined ? 'Score overridden successfully' : 'Candidate scored successfully',
        data: {
          applicationId: application.id,
          resumeScore: finalResult.resumeScore,
          breakdown: finalResult.breakdown,
          category: finalResult.category,
          redFlags: finalResult.redFlags,
          provenance: finalResult.provenance,
          confidence: finalResult.confidence,
          recommendations: finalResult.recommendations,
        },
      });
    } catch (error) {
      console.error('Score candidate error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to score candidate',
      });
    }
  }

  // PUT: Override existing score with audit trail
  if (req.method === 'PUT') {
    const { applicationId, newScore, reason, overriddenBy } = req.body;

    if (!applicationId || newScore === undefined || !reason) {
      return res.status(400).json({
        success: false,
        error: 'Application ID, new score, and reason are required for override',
      });
    }

    if (newScore < 0 || newScore > 100) {
      return res.status(400).json({
        success: false,
        error: 'Score must be between 0 and 100',
      });
    }

    try {
      const application = await prisma.application.findFirst({
        where: {
          id: applicationId,
          candidateId,
        },
      });

      if (!application) {
        return res.status(404).json({
          success: false,
          error: 'Application not found',
        });
      }

      const previousScore = application.resumeScore;
      const newCategory = EnhancedScoringService.getScoreCategory(newScore);

      // Update the application
      await prisma.application.update({
        where: { id: applicationId },
        data: {
          resumeScore: newScore,
          overallScore: newScore,
          scoreCategory: newCategory.category,
          scoredAt: new Date(),
          scoredBy: overriddenBy || 'admin',
          lastProgressAt: new Date(),
        },
      });

      // Create audit log
      try {
        await prisma.scoreAuditLog.create({
          data: {
            candidateId,
            applicationId,
            jobId: application.jobId,
            previousScore: previousScore || 0,
            newScore,
            scoreChange: previousScore ? newScore - previousScore : newScore,
            previousBreakdown: null,
            newBreakdown: { overridden: true },
            actorType: 'admin',
            actorId: overriddenBy || 'admin',
            actorName: overriddenBy || 'Administrator',
            action: 'manual-override',
            reason,
            scoringVersion: 'manual',
            dataSourcesUsed: ['admin-override'],
            algorithmDetails: null,
            explanation: { reason },
          },
        });
      } catch (auditError) {
        console.warn('Failed to create audit log:', auditError);
      }

      return res.status(200).json({
        success: true,
        message: 'Score overridden successfully',
        data: {
          applicationId,
          previousScore,
          newScore,
          category: newCategory,
          overriddenBy: overriddenBy || 'admin',
          reason,
          overriddenAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Override score error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to override score',
      });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
