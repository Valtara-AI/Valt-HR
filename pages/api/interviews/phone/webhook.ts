import { InterviewService } from '@/lib/services/interview.service';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * POST /api/interviews/phone/webhook
 * Webhook to receive phone interview events (transcripts, completion)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { interviewId, event, data } = req.body;

    if (!interviewId || !event) {
      return res.status(400).json({ 
        error: 'Missing required fields: interviewId, event' 
      });
    }

    const interviewService = new InterviewService();

    switch (event) {
      case 'transcript_ready':
        await interviewService.processTranscript(
          parseInt(interviewId),
          data.transcript,
          data.duration
        );
        break;

      case 'call_completed':
        await interviewService.completePhoneInterview(
          parseInt(interviewId),
          data.success,
          data.metadata
        );
        break;

      case 'call_failed':
        await interviewService.markInterviewFailed(
          parseInt(interviewId),
          data.reason
        );
        break;

      default:
        console.warn(`Unknown webhook event: ${event}`);
    }

    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Phone interview webhook error:', error);
    res.status(500).json({ 
      error: 'Failed to process webhook',
      details: error.message 
    });
  }
}
