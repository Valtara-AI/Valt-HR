import prisma from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * POST /api/onboarding/[id]/tasks/[taskId]/complete
 * Mark onboarding task as complete
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id, taskId } = req.query;
    const { notes, completedBy } = req.body;

    const task = await prisma.onboardingTask.update({
      where: { id: parseInt(taskId as string) },
      data: {
        status: 'completed',
        completedAt: new Date(),
        notes,
        completedBy,
      },
    });

    // Check if all tasks are complete to update onboarding status
    const allTasks = await prisma.onboardingTask.findMany({
      where: { onboardingId: parseInt(id as string) },
    });

    const allComplete = allTasks.every((t) => t.status === 'completed');

    if (allComplete) {
      await prisma.onboarding.update({
        where: { id: parseInt(id as string) },
        data: { status: 'completed', completedAt: new Date() },
      });
    }

    res.status(200).json({
      taskId: task.id,
      onboardingComplete: allComplete,
      message: 'Task marked as complete'
    });
  } catch (error: any) {
    console.error('Complete task error:', error);
    res.status(500).json({ 
      error: 'Failed to complete task',
      details: error.message 
    });
  }
}
