import { NotificationService } from '@/lib/services/notification.service';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * POST /api/notifications/send
 * Send custom notification to candidate or hiring manager
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, recipientEmail, recipientName, data } = req.body;

    if (!type || !recipientEmail || !recipientName) {
      return res.status(400).json({ 
        error: 'Missing required fields: type, recipientEmail, recipientName' 
      });
    }

    switch (type) {
      case 'application_received':
        await NotificationService.sendApplicationConfirmation(
          recipientEmail,
          recipientName,
          data.jobTitle
        );
        break;

      case 'assessment_invitation':
        await NotificationService.sendAssessmentInvitation(
          recipientEmail,
          recipientName,
          data.assessmentLink,
          new Date(data.deadline)
        );
        break;

      case 'interview_scheduled':
        await NotificationService.sendInterviewConfirmation(
          recipientEmail,
          recipientName,
          data.interviewType,
          new Date(data.scheduledAt),
          data.meetingLink
        );
        break;

      case 'top_candidate_alert':
        await NotificationService.notifyHiringManager(
          recipientEmail,
          data.candidateName,
          data.jobTitle,
          data.score,
          data.dashboardLink
        );
        break;

      default:
        return res.status(400).json({ error: `Unknown notification type: ${type}` });
    }

    res.status(200).json({ 
      success: true,
      message: 'Notification sent successfully' 
    });
  } catch (error: any) {
    console.error('Send notification error:', error);
    res.status(500).json({ 
      error: 'Failed to send notification',
      details: error.message 
    });
  }
}
