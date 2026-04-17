import prisma from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * GET /api/analytics/recruitment-metrics
 * Get recruitment KPIs and metrics
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { startDate, endDate, jobId } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    // Build filter
    const filter: any = {
      createdAt: {
        gte: start,
        lte: end,
      },
    };

    if (jobId) {
      filter.jobId = parseInt(jobId as string);
    }

    // Get applications data
    const applications = await prisma.application.findMany({
      where: filter,
      include: {
        candidate: true,
        job: true,
      },
    });

    // Calculate metrics
    const totalApplications = applications.length;
    const uniqueCandidates = new Set(applications.map(a => a.candidateId)).size;

    const stageCount = {
      screening: applications.filter(a => a.stage === 'screening').length,
      assessment: applications.filter(a => a.stage === 'assessment').length,
      interview: applications.filter(a => a.stage === 'interview').length,
      offer: applications.filter(a => a.stage === 'offer').length,
      hired: applications.filter(a => a.stage === 'hired').length,
      rejected: applications.filter(a => a.stage === 'rejected').length,
    };

    // Calculate time-to-hire (average)
    const hiredApps = applications.filter(a => a.stage === 'hired' && a.hiredAt);
    const avgTimeToHire = hiredApps.length > 0
      ? hiredApps.reduce((sum, app) => {
          const days = Math.floor((app.hiredAt!.getTime() - app.createdAt.getTime()) / (1000 * 60 * 60 * 24));
          return sum + days;
        }, 0) / hiredApps.length
      : 0;

    // Calculate conversion rates
    const screeningToAssessment = stageCount.screening > 0 
      ? (stageCount.assessment / stageCount.screening * 100).toFixed(1)
      : 0;
    const assessmentToInterview = stageCount.assessment > 0
      ? (stageCount.interview / stageCount.assessment * 100).toFixed(1)
      : 0;
    const interviewToOffer = stageCount.interview > 0
      ? (stageCount.offer / stageCount.interview * 100).toFixed(1)
      : 0;
    const offerToHire = stageCount.offer > 0
      ? (stageCount.hired / stageCount.offer * 100).toFixed(1)
      : 0;

    // Get top performing jobs
    const jobPerformance = await prisma.application.groupBy({
      by: ['jobId'],
      where: filter,
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 5,
    });

    const topJobs = await Promise.all(
      jobPerformance.map(async (jp) => {
        const job = await prisma.job.findUnique({ where: { id: jp.jobId } });
        return {
          jobId: jp.jobId,
          title: job?.title || 'Unknown',
          applicationCount: jp._count.id,
        };
      })
    );

    res.status(200).json({
      period: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
      overview: {
        totalApplications,
        uniqueCandidates,
        avgTimeToHire: Math.round(avgTimeToHire),
        hiredCount: stageCount.hired,
      },
      stageDistribution: stageCount,
      conversionRates: {
        screeningToAssessment: parseFloat(screeningToAssessment as string),
        assessmentToInterview: parseFloat(assessmentToInterview as string),
        interviewToOffer: parseFloat(interviewToOffer as string),
        offerToHire: parseFloat(offerToHire as string),
      },
      topJobs,
    });
  } catch (error: any) {
    console.error('Get recruitment metrics error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve recruitment metrics',
      details: error.message 
    });
  }
}
