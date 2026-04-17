import prisma from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * POST /api/onboarding/start
 * Initialize onboarding process for new hire
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { candidateId, startDate, position, department, managerId } = req.body;

    if (!candidateId || !startDate || !position) {
      return res.status(400).json({ 
        error: 'Missing required fields: candidateId, startDate, position' 
      });
    }

    // Create onboarding record
    const onboarding = await prisma.onboarding.create({
      data: {
        candidateId: parseInt(candidateId),
        startDate: new Date(startDate),
        position,
        department,
        managerId,
        status: 'pending',
        currentStep: 'documents',
        createdAt: new Date(),
      },
    });

    // Create onboarding tasks
    const tasks = [
      { title: 'Complete employment forms', category: 'documents', dueDate: new Date(startDate) },
      { title: 'Upload identification documents', category: 'documents', dueDate: new Date(startDate) },
      { title: 'Set up direct deposit', category: 'payroll', dueDate: new Date(new Date(startDate).getTime() + 2 * 24 * 60 * 60 * 1000) },
      { title: 'IT equipment setup', category: 'equipment', dueDate: new Date(new Date(startDate).getTime() + 3 * 24 * 60 * 60 * 1000) },
      { title: 'System access provisioning', category: 'access', dueDate: new Date(new Date(startDate).getTime() + 3 * 24 * 60 * 60 * 1000) },
      { title: 'Complete orientation training', category: 'training', dueDate: new Date(new Date(startDate).getTime() + 7 * 24 * 60 * 60 * 1000) },
      { title: 'Meet with buddy/mentor', category: 'integration', dueDate: new Date(new Date(startDate).getTime() + 7 * 24 * 60 * 60 * 1000) },
      { title: '30-day check-in', category: 'review', dueDate: new Date(new Date(startDate).getTime() + 30 * 24 * 60 * 60 * 1000) },
      { title: '60-day check-in', category: 'review', dueDate: new Date(new Date(startDate).getTime() + 60 * 24 * 60 * 60 * 1000) },
      { title: '90-day performance review', category: 'review', dueDate: new Date(new Date(startDate).getTime() + 90 * 24 * 60 * 60 * 1000) },
    ];

    await Promise.all(
      tasks.map((task) =>
        prisma.onboardingTask.create({
          data: {
            onboardingId: onboarding.id,
            ...task,
            status: 'pending',
          },
        })
      )
    );

    res.status(200).json({
      onboardingId: onboarding.id,
      tasksCreated: tasks.length,
      message: 'Onboarding process initiated successfully'
    });
  } catch (error: any) {
    console.error('Start onboarding error:', error);
    res.status(500).json({ 
      error: 'Failed to start onboarding',
      details: error.message 
    });
  }
}
