// lib/queue.ts - BullMQ job queue setup
import { Queue } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

// Define queue names
export const QueueNames = {
  RESUME_PARSING: 'resume-parsing',
  CANDIDATE_SCORING: 'candidate-scoring',
  ASSESSMENT_EVALUATION: 'assessment-evaluation',
  INTERVIEW_ANALYSIS: 'interview-analysis',
  NOTIFICATIONS: 'notifications',
  CRM_SYNC: 'crm-sync',
} as const;

// Create queues
export const resumeParsingQueue = new Queue(QueueNames.RESUME_PARSING, { connection });
export const candidateScoringQueue = new Queue(QueueNames.CANDIDATE_SCORING, { connection });
export const assessmentEvaluationQueue = new Queue(QueueNames.ASSESSMENT_EVALUATION, { connection });
export const interviewAnalysisQueue = new Queue(QueueNames.INTERVIEW_ANALYSIS, { connection });
export const notificationsQueue = new Queue(QueueNames.NOTIFICATIONS, { connection });
export const crmSyncQueue = new Queue(QueueNames.CRM_SYNC, { connection });

// Export connection for workers
export { connection };

