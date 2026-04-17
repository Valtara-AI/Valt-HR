// pages/api/candidates/[id]/enrich.ts - Social media audit and background validation
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/db';
import { BackgroundCheckService } from '../../../../lib/services/background-check.service';
import { LinkedInEnrichmentService } from '../../../../lib/services/linkedin-enrichment.service';

interface EnrichmentOptions {
  runLinkedInEnrichment?: boolean;
  runBackgroundCheck?: boolean;
  backgroundCheckTypes?: string[];
  consent?: {
    linkedIn: boolean;
    backgroundCheck: boolean;
    timestamp: string;
    method: 'electronic' | 'paper' | 'verbal';
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { id } = req.query;
  const candidateId = String(id);
  const options: EnrichmentOptions = req.body || {};

  try {
    // Fetch candidate with resume data
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: 'Candidate not found',
      });
    }

    const resumeData = candidate.resumeParsedData as any || {};
    const enrichmentResults: any = {
      candidateId,
      linkedIn: null,
      backgroundCheck: null,
      redFlags: [],
      enrichmentScore: 0,
      auditTrail: [],
    };

    // ===== LinkedIn Enrichment =====
    if (options.runLinkedInEnrichment !== false) {
      const linkedinUrl = candidate.linkedinUrl || resumeData?.personalInfo?.linkedinUrl;
      
      if (linkedinUrl) {
        const linkedInResult = await LinkedInEnrichmentService.enrichProfile(
          linkedinUrl,
          candidate.email,
          {
            consentProvided: options.consent?.linkedIn ?? true, // Default to true if not specified
            consentTimestamp: options.consent?.timestamp ? new Date(options.consent.timestamp) : new Date(),
            consentType: 'explicit',
          }
        );

        if (linkedInResult.success && linkedInResult.profile) {
          // Calculate enrichment score from LinkedIn data
          const linkedInScore = LinkedInEnrichmentService.calculateEnrichmentScore(linkedInResult.profile);
          
          enrichmentResults.linkedIn = {
            profile: linkedInResult.profile,
            score: linkedInScore.score,
            factors: linkedInScore.factors,
            recommendation: linkedInScore.recommendation,
          };

          // Store LinkedIn enrichment data
          try {
            await prisma.linkedInEnrichment.upsert({
              where: {
                candidateId_profileUrl: {
                  candidateId,
                  profileUrl: linkedinUrl,
                },
              },
              create: {
                candidateId,
                profileUrl: linkedinUrl,
                profileId: linkedInResult.profile.profileUrl.split('/in/')[1]?.replace('/', ''),
                consentProvided: true,
                consentTimestamp: new Date(),
                profileData: linkedInResult.profile.profileData as any,
                completenessScore: linkedInResult.profile.completenessScore,
                presenceScore: linkedInResult.profile.professionalPresenceScore,
                connectionCount: linkedInResult.profile.profileData?.connectionCount,
                followerCount: linkedInResult.profile.profileData?.followerCount,
                endorsementCount: linkedInResult.profile.endorsements.total,
                recommendationCount: linkedInResult.profile.recommendations.received,
                postsLastMonth: linkedInResult.profile.activity.postsLastMonth,
                isActive: linkedInResult.profile.activity.isActive,
                enrichmentScore: linkedInScore.score,
                scoreImpact: linkedInScore.score >= 80 ? 5 : linkedInScore.score < 50 ? -5 : 0,
                source: linkedInResult.profile.source,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
              },
              update: {
                profileData: linkedInResult.profile.profileData as any,
                completenessScore: linkedInResult.profile.completenessScore,
                presenceScore: linkedInResult.profile.professionalPresenceScore,
                connectionCount: linkedInResult.profile.profileData?.connectionCount,
                endorsementCount: linkedInResult.profile.endorsements.total,
                enrichmentScore: linkedInScore.score,
                scoreImpact: linkedInScore.score >= 80 ? 5 : linkedInScore.score < 50 ? -5 : 0,
                source: linkedInResult.profile.source,
                fetchedAt: new Date(),
              },
            });
          } catch (dbError) {
            console.warn('Failed to store LinkedIn enrichment (table may not exist):', dbError);
          }

          enrichmentResults.auditTrail.push({
            action: 'LINKEDIN_ENRICHMENT',
            timestamp: new Date(),
            result: 'success',
            score: linkedInScore.score,
          });
        } else {
          enrichmentResults.linkedIn = {
            error: linkedInResult.error,
            consentRequired: linkedInResult.consentRequired,
          };

          if (!linkedInResult.consentProvided) {
            enrichmentResults.redFlags.push({
              type: 'CONSENT_REQUIRED',
              severity: 'medium',
              description: 'LinkedIn enrichment requires candidate consent',
            });
          }
        }
      } else {
        enrichmentResults.linkedIn = {
          error: 'No LinkedIn URL provided',
          suggestion: 'Request LinkedIn profile from candidate',
        };
        
        enrichmentResults.redFlags.push({
          type: 'NO_LINKEDIN',
          severity: 'low',
          description: 'Candidate has not provided a LinkedIn profile URL',
        });
      }
    }

    // ===== Background Check =====
    if (options.runBackgroundCheck === true) {
      const hasBackgroundConsent = options.consent?.backgroundCheck ?? false;

      if (!hasBackgroundConsent) {
        enrichmentResults.backgroundCheck = {
          status: 'consent_required',
          error: 'Background check requires explicit candidate consent (FCRA compliance)',
        };
      } else {
        try {
          const checkTypes = (options.backgroundCheckTypes || ['identity', 'employment']) as any[];
          
          const backgroundResult = await BackgroundCheckService.initiateCheck({
            candidateId,
            candidateEmail: candidate.email,
            candidateName: `${candidate.firstName} ${candidate.lastName}`,
            candidatePhone: candidate.phone || undefined,
            types: checkTypes,
            consent: {
              provided: true,
              timestamp: new Date(),
              method: options.consent?.method || 'electronic',
            },
            additionalInfo: {
              previousEmployers: resumeData?.experience?.map((exp: any) => ({
                company: exp.company,
                title: exp.title,
                startDate: exp.startDate,
                endDate: exp.endDate,
              })),
              educationHistory: resumeData?.education?.map((edu: any) => ({
                institution: edu.institution,
                degree: edu.degree,
                graduationYear: edu.graduationYear || new Date(edu.endDate).getFullYear(),
              })),
            },
          });

          enrichmentResults.backgroundCheck = {
            checkId: backgroundResult.checkId,
            status: backgroundResult.status,
            provider: backgroundResult.provider,
            manualReviewRequired: backgroundResult.manualVerificationRequired,
            requestedAt: backgroundResult.requestedAt,
          };

          // Store background check record
          try {
            await prisma.backgroundCheck.create({
              data: {
                candidateId,
                checkId: backgroundResult.checkId,
                provider: backgroundResult.provider,
                checkType: checkTypes.join(','),
                status: backgroundResult.status,
                consentProvided: true,
                consentTimestamp: new Date(),
                consentMethod: options.consent?.method || 'electronic',
                manualReviewRequired: backgroundResult.manualVerificationRequired,
                manualReviewNotes: backgroundResult.manualVerificationNotes,
              },
            });
          } catch (dbError) {
            console.warn('Failed to store background check (table may not exist):', dbError);
          }

          enrichmentResults.auditTrail.push({
            action: 'BACKGROUND_CHECK_INITIATED',
            timestamp: new Date(),
            checkId: backgroundResult.checkId,
            provider: backgroundResult.provider,
            status: backgroundResult.status,
          });

          // If manual review required, add as yellow flag
          if (backgroundResult.manualVerificationRequired) {
            enrichmentResults.redFlags.push({
              type: 'MANUAL_VERIFICATION',
              severity: 'medium',
              description: 'Background check requires manual verification - automated provider not available',
            });
          }
        } catch (bgError) {
          console.error('Background check error:', bgError);
          enrichmentResults.backgroundCheck = {
            status: 'error',
            error: bgError instanceof Error ? bgError.message : 'Failed to initiate background check',
          };
        }
      }
    }

    // ===== Additional Red Flag Detection =====
    const additionalRedFlags = detectAdditionalRedFlags(resumeData, candidate);
    enrichmentResults.redFlags.push(...additionalRedFlags);

    // ===== Calculate Overall Enrichment Score =====
    let enrichmentScore = 50; // Base score

    // LinkedIn contribution (up to 30 points)
    if (enrichmentResults.linkedIn?.score) {
      enrichmentScore += Math.round((enrichmentResults.linkedIn.score / 100) * 30);
    }

    // Background check contribution (up to 20 points)
    if (enrichmentResults.backgroundCheck?.status === 'clear') {
      enrichmentScore += 20;
    } else if (enrichmentResults.backgroundCheck?.status === 'pending') {
      enrichmentScore += 10;
    }

    // Red flag deductions
    const highSeverityFlags = enrichmentResults.redFlags.filter((f: any) => f.severity === 'high').length;
    const mediumSeverityFlags = enrichmentResults.redFlags.filter((f: any) => f.severity === 'medium').length;
    enrichmentScore -= (highSeverityFlags * 10) + (mediumSeverityFlags * 5);
    enrichmentScore = Math.max(0, Math.min(100, enrichmentScore));

    enrichmentResults.enrichmentScore = enrichmentScore;

    // ===== Update Applications with Enrichment Data =====
    const applications = await prisma.application.findMany({
      where: { candidateId },
    });

    for (const app of applications) {
      const currentScore = app.resumeScore || 0;
      
      // Calculate score adjustment based on enrichment
      let scoreAdjustment = 0;
      if (enrichmentScore >= 80) {
        scoreAdjustment = 5;
      } else if (enrichmentScore < 40) {
        scoreAdjustment = -5;
      }

      // Additional penalty for high-severity red flags
      if (highSeverityFlags >= 2) {
        scoreAdjustment -= 5;
      }

      const adjustedScore = Math.max(0, Math.min(100, currentScore + scoreAdjustment));

      try {
        await prisma.application.update({
          where: { id: app.id },
          data: {
            socialScore: enrichmentResults.linkedIn?.score || null,
            linkedInEnriched: !!enrichmentResults.linkedIn?.profile,
            enrichmentData: {
              linkedIn: enrichmentResults.linkedIn,
              backgroundCheck: enrichmentResults.backgroundCheck,
              enrichmentScore,
              lastEnrichedAt: new Date(),
            } as any,
            backgroundCheckStatus: enrichmentResults.backgroundCheck?.status || null,
            backgroundCheckId: enrichmentResults.backgroundCheck?.checkId || null,
            redFlags: enrichmentResults.redFlags as any,
            redFlagCount: enrichmentResults.redFlags.length,
            overallScore: adjustedScore,
            lastProgressAt: new Date(),
          },
        });

        // Create audit log for score adjustment
        if (scoreAdjustment !== 0) {
          try {
            await prisma.scoreAuditLog.create({
              data: {
                candidateId,
                applicationId: app.id,
                previousScore: currentScore,
                newScore: adjustedScore,
                scoreChange: scoreAdjustment,
                previousBreakdown: null,
                newBreakdown: { enrichmentAdjustment: scoreAdjustment },
                actorType: 'system',
                actorId: 'enrichment-service',
                actorName: 'Enrichment Service',
                action: 'enrichment-adjustment',
                reason: `Score adjusted by ${scoreAdjustment} based on enrichment score of ${enrichmentScore}`,
                scoringVersion: '2.0.0',
                dataSourcesUsed: ['linkedin', 'background-check'],
                explanation: {
                  enrichmentScore,
                  linkedInScore: enrichmentResults.linkedIn?.score,
                  backgroundCheckStatus: enrichmentResults.backgroundCheck?.status,
                  redFlagCount: enrichmentResults.redFlags.length,
                },
              },
            });
          } catch (auditError) {
            console.warn('Failed to create enrichment audit log:', auditError);
          }
        }
      } catch (updateError) {
        console.warn('Failed to update application:', updateError);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Candidate enrichment completed',
      data: enrichmentResults,
    });
  } catch (error) {
    console.error('Candidate enrichment error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to enrich candidate data',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Detect additional red flags from resume data
 */
function detectAdditionalRedFlags(
  resumeData: any,
  candidate: any
): Array<{ type: string; severity: 'low' | 'medium' | 'high'; description: string; evidence?: string }> {
  const redFlags: Array<{ type: string; severity: 'low' | 'medium' | 'high'; description: string; evidence?: string }> = [];

  // Missing contact information
  if (!candidate.phone && !resumeData?.personalInfo?.phone) {
    redFlags.push({
      type: 'MISSING_PHONE',
      severity: 'low',
      description: 'Missing phone number - may delay communication',
    });
  }

  // No skills listed
  if (!candidate.skills?.length && !resumeData?.skills?.length) {
    redFlags.push({
      type: 'NO_SKILLS',
      severity: 'medium',
      description: 'No skills listed in resume',
    });
  }

  // No work experience
  const experience = candidate.experience || resumeData?.experience || [];
  if (experience.length === 0) {
    redFlags.push({
      type: 'NO_EXPERIENCE',
      severity: 'medium',
      description: 'No work experience listed',
    });
  } else {
    // Check for job hopping
    const shortJobs = experience.filter((exp: any) => {
      if (!exp.endDate) return false;
      const months = (new Date(exp.endDate).getTime() - new Date(exp.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30);
      return months < 12;
    });

    if (shortJobs.length >= 3) {
      redFlags.push({
        type: 'JOB_HOPPING',
        severity: 'medium',
        description: 'Pattern of short job tenures detected',
        evidence: `${shortJobs.length} positions lasting less than 1 year`,
      });
    }

    // Check for employment gaps
    const sortedExp = [...experience].sort(
      (a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    for (let i = 1; i < sortedExp.length; i++) {
      const prevEnd = sortedExp[i - 1].endDate ? new Date(sortedExp[i - 1].endDate) : new Date();
      const currentStart = new Date(sortedExp[i].startDate);
      const gapMonths = (currentStart.getTime() - prevEnd.getTime()) / (1000 * 60 * 60 * 24 * 30);

      if (gapMonths > 12) {
        redFlags.push({
          type: 'EMPLOYMENT_GAP',
          severity: gapMonths > 24 ? 'high' : 'medium',
          description: `${Math.round(gapMonths)} month employment gap detected`,
          evidence: `Between ${sortedExp[i - 1].company} and ${sortedExp[i].company}`,
        });
      }
    }
  }

  // No education listed
  const education = candidate.education || resumeData?.education || [];
  if (education.length === 0) {
    redFlags.push({
      type: 'NO_EDUCATION',
      severity: 'low',
      description: 'No education history listed',
    });
  }

  return redFlags;
}
