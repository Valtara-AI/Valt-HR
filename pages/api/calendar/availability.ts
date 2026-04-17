import { CalendarService } from '@/lib/services/calendar.service';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * GET /api/calendar/availability
 * Check interviewer availability
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, startDate, endDate } = req.query;

    if (!email || !startDate || !endDate) {
      return res.status(400).json({ 
        error: 'Missing required parameters: email, startDate, endDate' 
      });
    }

    const calendarService = new CalendarService();
    const availability = await calendarService.getAvailability(
      email as string,
      new Date(startDate as string),
      new Date(endDate as string)
    );

    res.status(200).json(availability);
  } catch (error: any) {
    console.error('Check availability error:', error);
    res.status(500).json({ 
      error: 'Failed to check availability',
      details: error.message 
    });
  }
}
