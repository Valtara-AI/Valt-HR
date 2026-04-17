// workers/candidate-scoring.worker.ts - Background worker for scoring candidates
import { Job, Worker } from 'bullmq';
import prisma from '../lib/db';
import { NotificationService } from '../lib/services/notification.service';
import { ScoringService } from '../lib/services/scoring.service';

interface ScoringJobData {
  applicationId: string;
  candidateId: string;
  jobId: string;
}

const worker = new Worker(
  'candidate-scoring',
  async (job: Job<ScoringJobData>) => {
    const { applicationId, candidateId, jobId } = job.data;

    console.log(`[Scoring Worker] Processing application ${applicationId}`);

    try {
      // Fetch job requirements
      const jobData = await prisma.job.findUnique({
        where: { id: jobId },
      });

      if (!jobData) {
        throw new Error(`Job ${jobId} not found`);
      }

      // Fetch candidate data
      const candidate = await prisma.candidate.findUnique({
        where: { id: candidateId },
      });

      if (!candidate) {
        throw new Error(`Candidate ${candidateId} not found`);
      }

      // Extract job requirements from job data
      const jobRequirements = {
        requiredSkills: (jobData.requiredSkills || []) as string[],
        preferredSkills: (jobData.preferredSkills || []) as string[],
        minExperienceYears: jobData.minExperience || 0,
        requiredEducation: jobData.minEducation || '',
        // Additional requirements could be extracted from jobData.description
      };

      // Score the resume
      const scoringResult = await ScoringService.scoreResume(
        candidate.resumeParsedData as any,
        jobRequirements
      );

      // Update application with scoring results
      await prisma.application.update({
        where: { id: applicationId },
        data: {
          resumeScore: scoringResult.totalScore,
          skillsMatch: scoringResult.breakdown.skills,
          experienceMatch: scoringResult.breakdown.experience,
          educationMatch: scoringResult.breakdown.education,
          scoringDetails: scoringResult as any,
          stage:
            scoringResult.totalScore >= 60
              ? 'assessment-invitation'
              : 'rejected',
          rejectionReason:
            scoringResult.totalScore < 60
              ? 'Resume score below threshold'
              : null,
        },
      });

      // Check for red flags
      const redFlags = await ScoringService.detectRedFlags(
        candidate.resumeParsedData as any
      );

      if (redFlags.length > 0) {
        await prisma.candidate.update({
          where: { id: candidateId },
          data: {
            notes: `Red flags detected: ${redFlags.join(', ')}`,
          },
        });
      }

      // If qualified, send assessment invitation
      if (scoringResult.totalScore >= 60) {
        console.log(`[Scoring Worker] Candidate ${candidateId} qualified for assessment`);

        // Send assessment invitation email
        await NotificationService.sendAssessmentInvitation(
          candidate.email,
          `${candidate.firstName} ${candidate.lastName}`,
          jobData.title,
          'https://hr-suite.valtara.ai/assessments/start', // Would be dynamic assessment link
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        );

        // Update stage
        await prisma.application.update({
          where: { id: applicationId },
          data: {
            stage: 'assessment-pending',
          },
        });
      } else {
        console.log(`[Scoring Worker] Candidate ${candidateId} did not qualify (score: ${scoringResult.totalScore})`);
      }

      // Notify hiring manager if candidate is exceptional (90+)
      if (scoringResult.totalScore >= 90) {
        const hiringManager = await prisma.job.findUnique({
          where: { id: jobId },
          select: {
            hiringManagerEmail: true,
            hiringManagerName: true,
          },
        });

        if (hiringManager?.hiringManagerEmail) {
          await NotificationService.notifyHiringManager(
            hiringManager.hiringManagerEmail,
            hiringManager.hiringManagerName || 'Hiring Manager',
            jobData.title,
            [{
              name: `${candidate.firstName} ${candidate.lastName}`,
              email: candidate.email,
              score: scoringResult.totalScore,
              profileUrl: `https://hr-suite.valtara.ai/candidates/${candidateId}`,
            }]
          );
        }
      }

      console.log(`[Scoring Worker] Completed scoring for application ${applicationId}`);
      return { success: true, score: scoringResult.totalScore };
    } catch (error) {
      console.error(`[Scoring Worker] Error processing application ${applicationId}:`, error);
      
      // Update application with error
      await prisma.application.update({
        where: { id: applicationId },
        data: {
          stage: 'scoring-failed',
          notes: `Scoring failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      });

      throw error; // Re-throw to mark job as failed
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    },
    concurrency: 5, // Process 5 jobs concurrently
  }
);

worker.on('completed', (job) => {
  console.log(`[Scoring Worker] Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
  console.error(`[Scoring Worker] Job ${job?.id} failed:`, err);
});

worker.on('error', (err) => {
  console.error('[Scoring Worker] Worker error:', err);
});

console.log('[Scoring Worker] Candidate scoring worker started');

export default worker;
