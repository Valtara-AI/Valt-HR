import { CalendarService } from '@/lib/services/calendar.service';
import { NotificationService } from '@/lib/services/notification.service';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * POST /api/calendar/create-event
 * Create calendar event for interview
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      interviewerEmail, 
      candidateEmail,
      candidateName,
      startTime, 
      duration, 
      title,
      description 
    } = req.body;

    if (!interviewerEmail || !candidateEmail || !startTime || !duration) {
      return res.status(400).json({ 
        error: 'Missing required fields: interviewerEmail, candidateEmail, startTime, duration' 
      });
    }

    const calendarService = new CalendarService();
    const event = await calendarService.createCalendarEvent(
      interviewerEmail,
      candidateEmail,
      new Date(startTime),
      duration,
      title || 'Interview',
      description
    );

    // Send confirmation emails
    await NotificationService.sendInterviewConfirmation(
      candidateEmail,
      candidateName,
      'Final Interview',
      new Date(startTime),
      event.meetingLink
    );

    res.status(200).json({
      eventId: event.id,
      meetingLink: event.meetingLink,
      message: 'Calendar event created successfully'
    });
  } catch (error: any) {
    console.error('Create calendar event error:', error);
    res.status(500).json({ 
      error: 'Failed to create calendar event',
      details: error.message 
    });
  }
}
