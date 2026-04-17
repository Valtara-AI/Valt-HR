// lib/services/notification.service.ts - Email and SMS notifications
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import prisma from '../db';

export class NotificationService {
  private static emailTransporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY,
    },
  });

  private static twilioClient = process.env.TWILIO_ACCOUNT_SID
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

  /**
   * Send application received confirmation
   */
  static async sendApplicationConfirmation(
    candidateEmail: string,
    candidateName: string,
    jobTitle: string
  ): Promise<void> {
    const subject = `Application Received - ${jobTitle}`;
    const body = `
      <h2>Thank you for your application!</h2>
      <p>Hi ${candidateName},</p>
      <p>We've received your application for the <strong>${jobTitle}</strong> position.</p>
      <p>Our team will review your application and get back to you within 5-7 business days.</p>
      <p>What's next?</p>
      <ul>
        <li>Resume screening (1-2 days)</li>
        <li>Initial assessment (if qualified)</li>
        <li>Phone interview (top candidates)</li>
      </ul>
      <p>Best regards,<br/>Valtara HR Team</p>
    `;

    await this.sendEmail(candidateEmail, subject, body, 'candidate', 'application-received');
  }

  /**
   * Send assessment invitation
   */
  static async sendAssessmentInvitation(
    candidateEmail: string,
    candidateName: string,
    assessmentLink: string,
    deadline: Date
  ): Promise<void> {
    const subject = 'Complete Your Assessment - Valtara HR';
    const body = `
      <h2>You've been selected for the next stage!</h2>
      <p>Hi ${candidateName},</p>
      <p>Great news! Based on your resume, we'd like to invite you to complete an assessment.</p>
      <p><strong>Assessment Link:</strong> <a href="${assessmentLink}">${assessmentLink}</a></p>
      <p><strong>Deadline:</strong> ${deadline.toLocaleDateString()}</p>
      <p><strong>Time Limit:</strong> 45 minutes</p>
      <p>This assessment will evaluate:</p>
      <ul>
        <li>Technical skills</li>
        <li>Problem-solving ability</li>
        <li>Communication skills</li>
      </ul>
      <p>Good luck!<br/>Valtara HR Team</p>
    `;

    await this.sendEmail(candidateEmail, subject, body, 'candidate', 'assessment-ready');
  }

  /**
   * Send interview scheduled confirmation
   */
  static async sendInterviewConfirmation(
    candidateEmail: string,
    candidateName: string,
    interviewType: string,
    scheduledAt: Date,
    meetingLink?: string
  ): Promise<void> {
    const subject = `Interview Scheduled - ${interviewType}`;
    const body = `
      <h2>Your interview is confirmed!</h2>
      <p>Hi ${candidateName},</p>
      <p>Your ${interviewType} is scheduled for:</p>
      <p><strong>Date & Time:</strong> ${scheduledAt.toLocaleString()}</p>
      ${meetingLink ? `<p><strong>Join Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>` : ''}
      <p><strong>What to prepare:</strong></p>
      <ul>
        <li>Review your resume</li>
        <li>Prepare examples of past work</li>
        <li>Have questions ready for us</li>
      </ul>
      <p>See you soon!<br/>Valtara HR Team</p>
    `;

    await this.sendEmail(candidateEmail, subject, body, 'candidate', 'interview-scheduled');

    // Send SMS reminder if phone available
    // await this.sendSMS(candidatePhone, `Interview reminder: ${scheduledAt.toLocaleString()}`);
  }

  /**
   * Notify hiring manager of top candidate
   */
  static async notifyHiringManager(
    managerEmail: string,
    candidateName: string,
    jobTitle: string,
    score: number,
    dashboardLink: string
  ): Promise<void> {
    const subject = `New Top Candidate - ${jobTitle}`;
    const body = `
      <h2>New qualified candidate</h2>
      <p>A new candidate has progressed through screening with a high score.</p>
      <p><strong>Candidate:</strong> ${candidateName}</p>
      <p><strong>Position:</strong> ${jobTitle}</p>
      <p><strong>Overall Score:</strong> ${score}/100</p>
      <p><a href="${dashboardLink}">View Full Profile</a></p>
      <p>Valtara HR System</p>
    `;

    await this.sendEmail(managerEmail, subject, body, 'hiring-manager', 'status-update');
  }

  /**
   * Generic email sender
   */
  private static async sendEmail(
    to: string,
    subject: string,
    htmlBody: string,
    recipientType: string,
    notificationType: string,
    applicationId?: string
  ): Promise<void> {
    try {
      await this.emailTransporter.sendMail({
        from: `${process.env.SENDGRID_FROM_NAME} <${process.env.SENDGRID_FROM_EMAIL}>`,
        to,
        subject,
        html: htmlBody,
      });

      // Log notification
      await prisma.notification.create({
        data: {
          applicationId,
          recipient: to,
          recipientType,
          type: notificationType,
          channel: 'email',
          subject,
          body: htmlBody,
          status: 'sent',
          sentAt: new Date(),
        },
      });

      console.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      console.error('Email send error:', error);
      
      // Log failed notification
      await prisma.notification.create({
        data: {
          applicationId,
          recipient: to,
          recipientType,
          type: notificationType,
          channel: 'email',
          subject,
          body: htmlBody,
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      throw error;
    }
  }

  /**
   * Send SMS notification
   */
  static async sendSMS(to: string, message: string): Promise<void> {
    if (!this.twilioClient) {
      console.warn('Twilio not configured, skipping SMS');
      return;
    }

    try {
      await this.twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to,
      });

      console.log(`SMS sent to ${to}`);
    } catch (error) {
      console.error('SMS send error:', error);
      throw error;
    }
  }
}
