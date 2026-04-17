import prisma from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * POST /api/talent/development/create-plan
 * Create development plan for employee
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      employeeId, 
      currentRole,
      targetRole,
      skillGaps,
      learningPath,
      timeline 
    } = req.body;

    if (!employeeId || !currentRole || !targetRole) {
      return res.status(400).json({ 
        error: 'Missing required fields: employeeId, currentRole, targetRole' 
      });
    }

    const plan = await prisma.developmentPlan.create({
      data: {
        employeeId: parseInt(employeeId),
        currentRole,
        targetRole,
        skillGaps: skillGaps || [],
        learningPath: learningPath || [],
        timeline,
        status: 'active',
        progress: 0,
        createdAt: new Date(),
      },
    });

    res.status(200).json({
      planId: plan.id,
      message: 'Development plan created successfully'
    });
  } catch (error: any) {
    console.error('Create development plan error:', error);
    res.status(500).json({ 
      error: 'Failed to create development plan',
      details: error.message 
    });
  }
}
