// pages/api/assessments/[id]/submit.ts - Submit assessment answers
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/db';
import { AssessmentService } from '../../../../lib/services/assessment.service';
import { NotificationService } from '../../../../lib/services/notification.service';

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
    const { candidateId, answers, totalTime } = req.body;

    if (!candidateId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Invalid submission data' });
    }

    // Submit and score assessment
    const result = await AssessmentService.submitAssessment({
      assessmentId: id,
      candidateId,
      answers,
      totalTime: totalTime || 0,
    });

    // Get candidate and job info for notification
    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        candidate: true,
        job: true,
      },
    });

    if (assessment) {
      // Send results email
      await NotificationService.sendEmail(
        assessment.candidate.email,
        'Assessment Results',
        `
          <h2>Assessment Completed</h2>
          <p>Dear ${assessment.candidate.firstName},</p>
          <p>Thank you for completing the assessment for ${assessment.job.title}.</p>
          <p><strong>Your Score:</strong> ${result.percentage.toFixed(1)}%</p>
          ${
            result.advancesToPhase2
              ? '<p style="color: green;">🎉 Congratulations! You have qualified for Phase 2 assessment.</p>'
              : result.percentage >= 50
              ? '<p>Your results are under review. We will contact you within 3-5 business days.</p>'
              : '<p>Unfortunately, you did not meet the minimum score for this position.</p>'
          }
          <p>Best regards,<br/>HR Team</p>
        `
      );
    }

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Submit assessment error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
