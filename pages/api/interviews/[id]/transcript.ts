import { InterviewService } from '@/lib/services/interview.service';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * GET /api/interviews/[id]/transcript
 * Get interview transcript and analysis
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const interviewId = parseInt(id as string);

    if (isNaN(interviewId)) {
      return res.status(400).json({ error: 'Invalid interview ID' });
    }

    const interviewService = new InterviewService();
    const transcriptData = await interviewService.getTranscriptAnalysis(interviewId);

    res.status(200).json(transcriptData);
  } catch (error: any) {
    console.error('Get transcript error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve transcript',
      details: error.message 
    });
  }
}
