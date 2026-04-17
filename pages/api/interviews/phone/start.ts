import { InterviewService } from '@/lib/services/interview.service';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * POST /api/interviews/phone/start
 * Start an AI-conducted phone interview
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { candidateId, jobId, phoneNumber } = req.body;

    if (!candidateId || !jobId || !phoneNumber) {
      return res.status(400).json({ 
        error: 'Missing required fields: candidateId, jobId, phoneNumber' 
      });
    }

    const interviewService = new InterviewService();
    const interview = await interviewService.startPhoneInterview(
      parseInt(candidateId),
      parseInt(jobId),
      phoneNumber
    );

    res.status(200).json({
      interviewId: interview.id,
      status: interview.status,
      message: 'AI phone interview initiated',
      callId: interview.metadata?.callId
    });
  } catch (error: any) {
    console.error('Start phone interview error:', error);
    res.status(500).json({ 
      error: 'Failed to start phone interview',
      details: error.message 
    });
  }
}
