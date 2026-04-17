// pages/api/candidates/[id]/index.ts - Get candidate details
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const candidate = await prisma.candidate.findUnique({
      where: { id: String(id) },
      include: {
        applications: {
          include: {
            job: {
              select: {
                id: true,
                title: true,
                department: true,
                location: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        assessments: {
          orderBy: { createdAt: 'desc' },
        },
        interviews: {
          orderBy: { scheduledAt: 'desc' },
        },
      },
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: 'Candidate not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...candidate,
        // Calculate average score across all applications
        averageScore: candidate.applications.length > 0
          ? Math.round(
              candidate.applications.reduce((sum, app) => sum + (app.resumeScore || 0), 0) /
                candidate.applications.length
            )
          : null,
      },
    });
  } catch (error) {
    console.error('Get candidate error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch candidate',
    });
  }
}
