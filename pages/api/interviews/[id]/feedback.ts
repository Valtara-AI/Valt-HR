import { InterviewService } from '@/lib/services/interview.service';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * POST /api/interviews/[id]/feedback
 * Submit feedback for a human interview
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const interviewId = parseInt(id as string);
    const { interviewerId, ratings, notes, recommendation } = req.body;

    if (isNaN(interviewId) || !interviewerId || !ratings) {
      return res.status(400).json({ 
        error: 'Missing required fields: interviewerId, ratings' 
      });
    }

    const interviewService = new InterviewService();
    const feedback = await interviewService.submitInterviewFeedback(
      interviewId,
      interviewerId,
      ratings,
      notes,
      recommendation
    );

    res.status(200).json({
      feedbackId: feedback.id,
      message: 'Interview feedback submitted successfully'
    });
  } catch (error: any) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ 
      error: 'Failed to submit feedback',
      details: error.message 
    });
  }
}
