import { AssessmentService } from '@/lib/services/assessment.service';
import { NotificationService } from '@/lib/services/notification.service';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * POST /api/assessments/[id]/evaluate
 * Evaluate and score a completed assessment
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const assessmentId = parseInt(id as string);

    if (isNaN(assessmentId)) {
      return res.status(400).json({ error: 'Invalid assessment ID' });
    }

    const assessmentService = new AssessmentService();
    const result = await assessmentService.evaluateAssessment(assessmentId);

    // Send notification to candidate about completion
    const notificationService = new NotificationService();
    await notificationService.sendAssessmentCompletionEmail(
      result.candidateEmail,
      result.candidateName,
      result.score,
      result.passed
    );

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Assessment evaluation error:', error);
    res.status(500).json({ 
      error: 'Failed to evaluate assessment',
      details: error.message 
    });
  }
}
