// lib/services/calendar.service.ts - Calendar Integration Service (Phase 7)
import { google } from 'googleapis';
import prisma from '../db';
import { NotificationService } from './notification.service';

interface CalendarEvent {
  summary: string;
  description: string;
  startTime: Date;
  endTime: Date;
  attendees: { email: string; name: string }[];
  location?: string;
  meetingLink?: string;
}

export class CalendarService {
  private static oauth2Client: any;

  /**
   * Initialize Google Calendar OAuth client
   */
  private static getOAuthClient() {
    if (this.oauth2Client) {
      return this.oauth2Client;
    }

    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Set refresh token (would be stored per user in production)
    if (process.env.GOOGLE_REFRESH_TOKEN) {
      this.oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      });
    }

    return this.oauth2Client;
  }

  /**
   * Create a calendar event for an interview
   */
  static async scheduleInterview(
    interviewId: string,
    event: CalendarEvent
  ): Promise<string> {
    try {
      const auth = this.getOAuthClient();
      const calendar = google.calendar({ version: 'v3', auth });

      // Create Google Calendar event
      const eventResponse = await calendar.events.insert({
        calendarId: 'primary',
        conferenceDataVersion: 1,
        requestBody: {
          summary: event.summary,
          description: event.description,
          start: {
            dateTime: event.startTime.toISOString(),
            timeZone: 'America/New_York', // Should be configurable
          },
          end: {
            dateTime: event.endTime.toISOString(),
            timeZone: 'America/New_York',
          },
          attendees: event.attendees.map((a) => ({
            email: a.email,
            displayName: a.name,
          })),
          location: event.location,
          conferenceData: event.meetingLink
            ? undefined
            : {
                createRequest: {
                  requestId: `interview-${interviewId}`,
                  conferenceSolutionKey: {
                    type: 'hangoutsMeet',
                  },
                },
              },
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 24 * 60 }, // 1 day before
              { method: 'popup', minutes: 60 }, // 1 hour before
              { method: 'popup', minutes: 15 }, // 15 min before
            ],
          },
        },
      });

      const calendarEventId = eventResponse.data.id || '';
      const meetingLink =
        event.meetingLink ||
        eventResponse.data.hangoutLink ||
        eventResponse.data.conferenceData?.entryPoints?.[0]?.uri ||
        '';

      // Update interview with calendar info
      await prisma.interview.update({
        where: { id: interviewId },
        data: {
          calendarEventId,
          meetingLink,
        },
      });
      
      // Send confirmation emails
      for (const attendee of event.attendees) {
        await NotificationService.sendEmail(
          attendee.email,                 // 1. to
          'Interview Scheduled',          // 2. subject
          'Confirmation: ${event.title}', // 3. htmlBody (or your template string)
          'candidate',                    // 4. recipientType (Added)
          'interview-confirmation',       // 5. notificationType (Added)
           event.applicationId            // 6. applicationId (Added - ensure this exists on your event object)
            <h2>Interview Scheduled</h2>
            <p>Dear ${attendee.name},</p>
            <p><strong>${event.summary}</strong></p>
            <p><strong>Date:</strong> ${event.startTime.toLocaleString()}</p>
            <p><strong>Duration:</strong> ${Math.floor((event.endTime.getTime() - event.startTime.getTime()) / 60000)} minutes</p>
            ${meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>` : ''}
            ${event.location ? `<p><strong>Location:</strong> ${event.location}</p>` : ''}
            <p>${event.description}</p>
            <p>A calendar invitation has been sent to your email.</p>
            <p>Best regards,<br/>HR Team</p>
          `
        );
      }

      return calendarEventId;
    } catch (error) {
      console.error('Calendar scheduling error:', error);
      throw new Error('Failed to schedule interview on calendar');
    }
  }

  /**
   * Update an existing calendar event
   */
  static async updateInterview(
    interviewId: string,
    updates: Partial<CalendarEvent>
  ): Promise<void> {
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
    });

    if (!interview || !interview.calendarEventId) {
      throw new Error('Interview or calendar event not found');
    }

    try {
      const auth = this.getOAuthClient();
      const calendar = google.calendar({ version: 'v3', auth });

      const updateData: any = {};

      if (updates.summary) updateData.summary = updates.summary;
      if (updates.description) updateData.description = updates.description;
      if (updates.startTime) {
        updateData.start = {
          dateTime: updates.startTime.toISOString(),
          timeZone: 'America/New_York',
        };
      }
      if (updates.endTime) {
        updateData.end = {
          dateTime: updates.endTime.toISOString(),
          timeZone: 'America/New_York',
        };
      }
      if (updates.attendees) {
        updateData.attendees = updates.attendees.map((a) => ({
          email: a.email,
          displayName: a.name,
        }));
      }
      if (updates.location) updateData.location = updates.location;

      await calendar.events.patch({
        calendarId: 'primary',
        eventId: interview.calendarEventId,
        requestBody: updateData,
      });

      // Update interview record
      const interviewUpdates: any = {};
      if (updates.startTime) interviewUpdates.scheduledAt = updates.startTime;
      if (updates.meetingLink) interviewUpdates.meetingLink = updates.meetingLink;

      await prisma.interview.update({
        where: { id: interviewId },
        data: interviewUpdates,
      });
    } catch (error) {
      console.error('Calendar update error:', error);
      throw new Error('Failed to update calendar event');
    }
  }

  /**
   * Cancel a calendar event
   */
  static async cancelInterview(interviewId: string): Promise<void> {
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        candidate: true,
        job: true,
      },
    });

    if (!interview || !interview.calendarEventId) {
      throw new Error('Interview or calendar event not found');
    }

    try {
      const auth = this.getOAuthClient();
      const calendar = google.calendar({ version: 'v3', auth });

      await calendar.events.delete({
        calendarId: 'primary',
        eventId: interview.calendarEventId,
      });

      // Update interview status
      await prisma.interview.update({
        where: { id: interviewId },
        data: {
          status: 'cancelled',
        },
      });

      // Send cancellation email
      await NotificationService.sendEmail(
        interview.candidate.email,
        'Interview Cancelled',
        `
          <h2>Interview Cancelled</h2>
          <p>Dear ${interview.candidate.firstName},</p>
          <p>Your interview for <strong>${interview.job.title}</strong> has been cancelled.</p>
          <p>We will reach out if we would like to reschedule.</p>
          <p>Best regards,<br/>HR Team</p>
        `
      );
    } catch (error) {
      console.error('Calendar cancellation error:', error);
      throw new Error('Failed to cancel calendar event');
    }
  }

  /**
   * Check interviewer availability
   */
  static async checkAvailability(
    interviewerEmail: string,
    startTime: Date,
    endTime: Date
  ): Promise<boolean> {
    try {
      const auth = this.getOAuthClient();
      const calendar = google.calendar({ version: 'v3', auth });

      const response = await calendar.freebusy.query({
        requestBody: {
          timeMin: startTime.toISOString(),
          timeMax: endTime.toISOString(),
          items: [{ id: interviewerEmail }],
        },
      });

      const busy = response.data.calendars?.[interviewerEmail]?.busy || [];
      return busy.length === 0; // Available if no busy periods
    } catch (error) {
      console.error('Availability check error:', error);
      return false;
    }
  }

  /**
   * Find available time slots
   */
  static async findAvailableSlots(
    interviewerEmails: string[],
    durationMinutes: number,
    daysAhead: number = 7
  ): Promise<Date[]> {
    try {
      const auth = this.getOAuthClient();
      const calendar = google.calendar({ version: 'v3', auth });

      const startTime = new Date();
      const endTime = new Date();
      endTime.setDate(endTime.getDate() + daysAhead);

      const response = await calendar.freebusy.query({
        requestBody: {
          timeMin: startTime.toISOString(),
          timeMax: endTime.toISOString(),
          items: interviewerEmails.map((email) => ({ id: email })),
        },
      });

      // Find common free slots (simplified)
      const availableSlots: Date[] = [];
      const businessHours = { start: 9, end: 17 }; // 9 AM - 5 PM

      for (let day = 0; day < daysAhead; day++) {
        const currentDay = new Date(startTime);
        currentDay.setDate(currentDay.getDate() + day);

        // Skip weekends
        if (currentDay.getDay() === 0 || currentDay.getDay() === 6) continue;

        for (let hour = businessHours.start; hour < businessHours.end; hour++) {
          const slotStart = new Date(currentDay);
          slotStart.setHours(hour, 0, 0, 0);
          const slotEnd = new Date(slotStart);
          slotEnd.setMinutes(slotEnd.getMinutes() + durationMinutes);

          // Check if all interviewers are available
          let allAvailable = true;
          for (const email of interviewerEmails) {
            const busy = response.data.calendars?.[email]?.busy || [];
            const isSlotBusy = busy.some((period: any) => {
              const periodStart = new Date(period.start);
              const periodEnd = new Date(period.end);
              return slotStart < periodEnd && slotEnd > periodStart;
            });

            if (isSlotBusy) {
              allAvailable = false;
              break;
            }
          }

          if (allAvailable) {
            availableSlots.push(slotStart);
          }
        }
      }

      return availableSlots.slice(0, 10); // Return top 10 slots
    } catch (error) {
      console.error('Find slots error:', error);
      return [];
    }
  }
}
