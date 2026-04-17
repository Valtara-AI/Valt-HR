// pages/api/interviews/schedule.ts - Schedule interview endpoint
import type { NextApiRequest, NextApiResponse } from 'next';
import { CalendarService } from '../../../lib/services/calendar.service';
import { InterviewService } from '../../../lib/services/interview.service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      candidateId,
      jobId,
      type, // 'ai-phone' | 'human-phone' | 'video' | 'in-person'
      scheduledAt,
      interviewerEmail,
      interviewerName,
      meetingLink,
      duration = 60, // minutes
    } = req.body;

    if (!candidateId || !jobId || !type || !scheduledAt) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Schedule interview
    const interviewId = await InterviewService.scheduleAIInterview({
      candidateId,
      jobId,
      type,
      scheduledAt: new Date(scheduledAt),
      interviewerEmail,
      interviewerName,
      meetingLink,
    });

    // Get interview details
    const interview = await InterviewService.getInterview(interviewId);

    // Create calendar event if type is not ai-phone
    if (type !== 'ai-phone' && interviewerEmail) {
      const startTime = new Date(scheduledAt);
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + duration);

      await CalendarService.scheduleInterview(interviewId, {
        summary: `Interview: ${interview?.job.title} - ${interview?.candidate.firstName} ${interview?.candidate.lastName}`,
        description: `${type} interview for ${interview?.job.title} position`,
        startTime,
        endTime,
        attendees: [
          {
            email: interview!.candidate.email,
            name: `${interview?.candidate.firstName} ${interview?.candidate.lastName}`,
          },
          {
            email: interviewerEmail,
            name: interviewerName || 'Interviewer',
          },
        ],
        meetingLink,
      });
    }

    return res.status(201).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error('Schedule interview error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
