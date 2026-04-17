import prisma from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * GET /api/analytics/pipeline-status
 * Get current pipeline status and candidate distribution
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { jobId } = req.query;

    const filter: any = {
      stage: {
        notIn: ['hired', 'rejected', 'withdrawn'],
      },
    };

    if (jobId) {
      filter.jobId = parseInt(jobId as string);
    }

    // Get active applications
    const applications = await prisma.application.findMany({
      where: filter,
      include: {
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Group by stage
    const byStage = {
      screening: applications.filter(a => a.stage === 'screening'),
      assessment: applications.filter(a => a.stage === 'assessment'),
      phone_interview: applications.filter(a => a.stage === 'phone_interview'),
      interview: applications.filter(a => a.stage === 'interview'),
      offer: applications.filter(a => a.stage === 'offer'),
    };

    // Get candidates requiring action
    const now = new Date();
    const requiresAction = applications.filter(a => {
      const daysSinceUpdate = Math.floor((now.getTime() - a.updatedAt.getTime()) / (1000 * 60 * 60 * 24));
      return daysSinceUpdate > 3; // No update in 3+ days
    });

    // Get top priority candidates (high scores, pending review)
    const topPriority = applications
      .filter(a => a.score && a.score >= 80)
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 10);

    res.status(200).json({
      total: applications.length,
      byStage: {
        screening: {
          count: byStage.screening.length,
          candidates: byStage.screening.slice(0, 5).map(formatCandidate),
        },
        assessment: {
          count: byStage.assessment.length,
          candidates: byStage.assessment.slice(0, 5).map(formatCandidate),
        },
        phone_interview: {
          count: byStage.phone_interview.length,
          candidates: byStage.phone_interview.slice(0, 5).map(formatCandidate),
        },
        interview: {
          count: byStage.interview.length,
          candidates: byStage.interview.slice(0, 5).map(formatCandidate),
        },
        offer: {
          count: byStage.offer.length,
          candidates: byStage.offer.slice(0, 5).map(formatCandidate),
        },
      },
      requiresAction: requiresAction.map(formatCandidate),
      topPriority: topPriority.map(formatCandidate),
    });
  } catch (error: any) {
    console.error('Get pipeline status error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve pipeline status',
      details: error.message 
    });
  }
}

function formatCandidate(app: any) {
  return {
    applicationId: app.id,
    candidateId: app.candidate.id,
    name: app.candidate.name,
    email: app.candidate.email,
    jobTitle: app.job.title,
    stage: app.stage,
    score: app.score,
    appliedAt: app.createdAt,
    lastUpdate: app.updatedAt,
  };
}
