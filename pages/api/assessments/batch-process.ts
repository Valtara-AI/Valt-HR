import { AssessmentService } from '@/lib/services/assessment.service';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * GET /api/assessments/batch-process
 * Process pending assessments in batch
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { limit = '10' } = req.query;
    const maxAssessments = parseInt(limit as string);

    const assessmentService = new AssessmentService();
    const results = await assessmentService.batchProcessAssessments(maxAssessments);

    res.status(200).json({
      processed: results.length,
      assessments: results,
      message: `Successfully processed ${results.length} assessments`
    });
  } catch (error: any) {
    console.error('Batch processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process assessments',
      details: error.message 
    });
  }
}
