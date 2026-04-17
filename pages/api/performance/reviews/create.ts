import prisma from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * POST /api/performance/reviews/create
 * Create performance review cycle
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      employeeId, 
      reviewerId, 
      reviewPeriodStart, 
      reviewPeriodEnd,
      dueDate,
      type 
    } = req.body;

    if (!employeeId || !reviewerId || !dueDate || !type) {
      return res.status(400).json({ 
        error: 'Missing required fields: employeeId, reviewerId, dueDate, type' 
      });
    }

    const review = await prisma.performanceReview.create({
      data: {
        employeeId: parseInt(employeeId),
        reviewerId: parseInt(reviewerId),
        reviewPeriodStart: reviewPeriodStart ? new Date(reviewPeriodStart) : new Date(),
        reviewPeriodEnd: reviewPeriodEnd ? new Date(reviewPeriodEnd) : new Date(),
        dueDate: new Date(dueDate),
        type, // 'quarterly', 'annual', 'probation'
        status: 'pending',
        createdAt: new Date(),
      },
    });

    res.status(200).json({
      reviewId: review.id,
      message: 'Performance review created successfully'
    });
  } catch (error: any) {
    console.error('Create review error:', error);
    res.status(500).json({ 
      error: 'Failed to create performance review',
      details: error.message 
    });
  }
}
