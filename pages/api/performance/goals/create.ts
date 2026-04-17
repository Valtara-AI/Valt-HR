import prisma from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * POST /api/performance/goals/create
 * Create performance goal for employee
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      employeeId, 
      title, 
      description, 
      category,
      targetDate,
      metrics 
    } = req.body;

    if (!employeeId || !title || !targetDate) {
      return res.status(400).json({ 
        error: 'Missing required fields: employeeId, title, targetDate' 
      });
    }

    const goal = await prisma.performanceGoal.create({
      data: {
        employeeId: parseInt(employeeId),
        title,
        description,
        category, // 'development', 'performance', 'behavioral'
        targetDate: new Date(targetDate),
        metrics,
        status: 'active',
        progress: 0,
        createdAt: new Date(),
      },
    });

    res.status(200).json({
      goalId: goal.id,
      message: 'Performance goal created successfully'
    });
  } catch (error: any) {
    console.error('Create goal error:', error);
    res.status(500).json({ 
      error: 'Failed to create performance goal',
      details: error.message 
    });
  }
}
