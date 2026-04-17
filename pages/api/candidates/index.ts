// pages/api/candidates/index.ts - List all candidates with filtering
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/db';
import { ScoringService } from '../../../lib/services/scoring.service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const {
      scoreMin,
      scoreMax,
      jobId,
      stage,
      search,
      limit = '50',
      offset = '0',
    } = req.query;

    // Build where clause
    const where: any = {};

    // Filter by job
    if (jobId) {
      where.applications = {
        some: {
          jobId: String(jobId),
        },
      };
    }

    // Filter by stage
    if (stage) {
      where.applications = {
        some: {
          stage: String(stage),
        },
      };
    }

    // Search by name or email
    if (search) {
      where.OR = [
        { firstName: { contains: String(search), mode: 'insensitive' } },
        { lastName: { contains: String(search), mode: 'insensitive' } },
        { email: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    // Fetch candidates
    const candidates = await prisma.candidate.findMany({
      where,
      include: {
        applications: {
          include: {
            job: {
              select: {
                id: true,
                title: true,
                department: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 1, // Most recent application
        },
      },
      take: parseInt(String(limit)),
      skip: parseInt(String(offset)),
      orderBy: { createdAt: 'desc' },
    });

    // Filter by score if provided
    let filteredCandidates = candidates;
    if (scoreMin || scoreMax) {
      filteredCandidates = candidates.filter(candidate => {
        if (candidate.applications.length === 0) return false;
        
        const score = candidate.applications[0].resumeScore || 0;
        
        if (scoreMin && score < parseInt(String(scoreMin))) return false;
        if (scoreMax && score > parseInt(String(scoreMax))) return false;
        
        return true;
      });
    }

    // Get total count
    const total = await prisma.candidate.count({ where });

    // Format response
    const formattedCandidates = filteredCandidates.map(candidate => {
      const latestApplication = candidate.applications[0];
      const score = latestApplication?.resumeScore || 0;

      return {
        id: candidate.id,
        name: `${candidate.firstName} ${candidate.lastName}`,
        email: candidate.email,
        phone: candidate.phone,
        resumeScore: score,
        category: ScoringService.getScoreCategory(score),
        currentStage: latestApplication?.stage,
        latestJob: latestApplication?.job.title,
        appliedAt: latestApplication?.createdAt,
        enrichmentScore: candidate.enrichmentScore,
        hasRedFlags: candidate.redFlags && (candidate.redFlags as any[]).length > 0,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        candidates: formattedCandidates,
        pagination: {
          total,
          limit: parseInt(String(limit)),
          offset: parseInt(String(offset)),
          hasMore: parseInt(String(offset)) + formattedCandidates.length < total,
        },
      },
    });
  } catch (error) {
    console.error('List candidates error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch candidates',
    });
  }
}
