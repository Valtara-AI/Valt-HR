// pages/api/assessments/[id]/start.ts - Start an assessment
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Assessment ID required' });
  }

  try {
    const assessment = await prisma.assessment.findUnique({
      where: { id },
    });

    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    if (assessment.status === 'completed') {
      return res.status(400).json({ error: 'Assessment already completed' });
    }

    if (new Date() > assessment.expiresAt) {
      return res.status(400).json({ error: 'Assessment has expired' });
    }

    // Update status to in-progress
    const updated = await prisma.assessment.update({
      where: { id },
      data: {
        status: 'in-progress',
        startedAt: new Date(),
      },
      include: {
        candidate: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        job: {
          select: {
            title: true,
            department: true,
          },
        },
      },
    });

    // Return assessment with questions (hide correct answers)
    interface Question {
      id: string;
      type: string;
      question: string;
      options?: string[];
      correctAnswer?: string | number;
      points: number;
      difficulty: string;
      skillCategory: string;
    }
    const questions = (updated.questions as Question[]).map((q: Question) => ({
      id: q.id,
      type: q.type,
      question: q.question,
      options: q.options,
      points: q.points,
      difficulty: q.difficulty,
      skillCategory: q.skillCategory,
      // Don't send correctAnswer to client
    }));

    return res.status(200).json({
      ...updated,
      questions,
    });
  } catch (error) {
    console.error('Start assessment error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
