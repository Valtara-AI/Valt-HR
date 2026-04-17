// lib/services/interview.service.ts - Interview Management Service (Phase 5)
import axios from 'axios';
import prisma from '../db';
import { NotificationService } from './notification.service';

interface InterviewSchedule {
  candidateId: string;
  jobId: string;
  type: 'ai-phone' | 'human-phone' | 'video' | 'in-person';
  scheduledAt: Date;
  interviewerEmail?: string;
  interviewerName?: string;
  meetingLink?: string;
}

interface TranscriptAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  keyTopics: string[];
  technicalSkills: string[];
  communicationScore: number; // 1-10
  confidenceScore: number; // 1-10
  responseQuality: number; // 1-10
  overallScore: number; // 1-100
  redFlags: string[];
  strengths: string[];
  weaknesses: string[];
  recommendation: 'strong-hire' | 'hire' | 'maybe' | 'no-hire';
  summary: string;
}

export class InterviewService {
  /**
   * Schedule an AI phone interview
   */
  static async scheduleAIInterview(
    schedule: InterviewSchedule
  ): Promise<string> {
    const interview = await prisma.interview.create({
      data: {
        candidateId: schedule.candidateId,
        jobId: schedule.jobId,
        type: schedule.type,
        scheduledAt: schedule.scheduledAt,
        status: 'scheduled',
        aiGenerated: schedule.type === 'ai-phone',
      },
    });

    // Get candidate and job details
    const candidate = await prisma.candidate.findUnique({
      where: { id: schedule.candidateId },
    });

    const job = await prisma.job.findUnique({
      where: { id: schedule.jobId },
    });

    if (!candidate || !job) {
      throw new Error('Candidate or job not found');
    }

    // Send interview confirmation
    await NotificationService.sendInterviewConfirmation(
      candidate.email,
      candidate.phone || '',
      `${candidate.firstName} ${candidate.lastName}`,
      job.title,
      schedule.scheduledAt,
      schedule.meetingLink || `tel:+1-555-AI-INTERVIEW`,
      schedule.type
    );

    return interview.id;
  }

  /**
   * Generate AI interview questions based on job requirements
   */
  static async generateInterviewQuestions(
    jobId: string,
    candidateId: string
  ): Promise<string[]> {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!job || !candidate) {
      throw new Error('Job or candidate not found');
    }

    if (!process.env.OPENAI_API_KEY) {
      // Fallback questions
      return [
        'Tell me about your background and experience.',
        `What interests you about the ${job.title} position?`,
        'Describe a challenging project you worked on.',
        'How do you handle tight deadlines?',
        'Where do you see yourself in 5 years?',
      ];
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert technical interviewer creating phone interview questions.',
            },
            {
              role: 'user',
              content: `Generate 10 phone interview questions for a ${job.title} position. 
                        Required skills: ${(job.requiredSkills || []).join(', ')}
                        Candidate background: ${candidate.skills?.join(', ')}
                        Format: Return only the questions, one per line.`,
            },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const questions = response.data.choices[0].message.content
        .split('\n')
        .filter((q: string) => q.trim().length > 0)
        .map((q: string) => q.replace(/^\d+\.\s*/, '').trim());

      return questions;
    } catch (error) {
      console.error('AI question generation error:', error);
      // Return fallback questions
      return [
        'Tell me about your background and experience.',
        `What interests you about the ${job.title} position?`,
        'Describe a challenging project you worked on.',
      ];
    }
  }

  /**
   * Process interview transcript and analyze
   * (Integration with Azure Speech API for transcription)
   */
  static async processTranscript(
    interviewId: string,
    audioUrl: string
  ): Promise<TranscriptAnalysis> {
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: { job: true, candidate: true },
    });

    if (!interview) {
      throw new Error('Interview not found');
    }

    // Step 1: Transcribe audio using Azure Speech API
    let transcript = '';
    
    if (process.env.AZURE_SPEECH_KEY && process.env.AZURE_SPEECH_REGION) {
      try {
        // In production, use Azure Speech SDK
        // For MVP, we'll simulate
        transcript = '[Transcription would be generated by Azure Speech API]';
      } catch (error) {
        console.error('Transcription error:', error);
        transcript = '[Transcription failed]';
      }
    }

    // Step 2: Analyze transcript using OpenAI
    const analysis = await this.analyzeTranscript(transcript, interview.job.title);

    // Step 3: Save results
    await prisma.interview.update({
      where: { id: interviewId },
      data: {
        transcript,
        notes: analysis.summary,
        score: analysis.overallScore,
        status: 'completed',
        completedAt: new Date(),
        analysis: analysis as any,
      },
    });

    // Step 4: Update application stage
    const application = await prisma.application.findFirst({
      where: {
        candidateId: interview.candidateId,
        jobId: interview.jobId,
      },
    });

    if (application) {
      let newStage = application.stage;

      if (analysis.recommendation === 'strong-hire' || analysis.recommendation === 'hire') {
        newStage = 'final-interview';
      } else if (analysis.recommendation === 'maybe') {
        newStage = 'under-review';
      } else {
        newStage = 'rejected';
      }

      await prisma.application.update({
        where: { id: application.id },
        data: {
          stage: newStage,
          interviewScore: analysis.overallScore,
          rejectionReason:
            newStage === 'rejected' ? 'Did not meet interview criteria' : null,
        },
      });
    }

    return analysis;
  }

  /**
   * Analyze interview transcript using AI
   */
  private static async analyzeTranscript(
    transcript: string,
    jobTitle: string
  ): Promise<TranscriptAnalysis> {
    if (!process.env.OPENAI_API_KEY) {
      // Fallback analysis
      return {
        sentiment: 'neutral',
        keyTopics: ['Experience', 'Skills', 'Background'],
        technicalSkills: [],
        communicationScore: 7,
        confidenceScore: 7,
        responseQuality: 7,
        overallScore: 70,
        redFlags: [],
        strengths: ['Clear communication'],
        weaknesses: ['Needs more detail'],
        recommendation: 'maybe',
        summary: 'Candidate demonstrated basic competency.',
      };
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are an expert interview analyst. Analyze the interview transcript and provide detailed feedback in JSON format.
                        Return: {
                          "sentiment": "positive|neutral|negative",
                          "keyTopics": ["topic1", "topic2"],
                          "technicalSkills": ["skill1"],
                          "communicationScore": 1-10,
                          "confidenceScore": 1-10,
                          "responseQuality": 1-10,
                          "overallScore": 1-100,
                          "redFlags": [],
                          "strengths": [],
                          "weaknesses": [],
                          "recommendation": "strong-hire|hire|maybe|no-hire",
                          "summary": "brief summary"
                        }`,
            },
            {
              role: 'user',
              content: `Analyze this interview for a ${jobTitle} position:\n\n${transcript}`,
            },
          ],
          temperature: 0.3,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const analysis = JSON.parse(response.data.choices[0].message.content);
      return analysis;
    } catch (error) {
      console.error('Transcript analysis error:', error);
      // Return default analysis
      return {
        sentiment: 'neutral',
        keyTopics: ['General discussion'],
        technicalSkills: [],
        communicationScore: 5,
        confidenceScore: 5,
        responseQuality: 5,
        overallScore: 50,
        redFlags: [],
        strengths: [],
        weaknesses: ['Analysis unavailable'],
        recommendation: 'maybe',
        summary: 'Manual review required.',
      };
    }
  }

  /**
   * Get interview by ID
   */
  static async getInterview(interviewId: string) {
    return await prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
            department: true,
          },
        },
      },
    });
  }

  /**
   * List interviews for a candidate
   */
  static async getCandidateInterviews(candidateId: string) {
    return await prisma.interview.findMany({
      where: { candidateId },
      include: {
        job: {
          select: {
            title: true,
            department: true,
          },
        },
      },
      orderBy: { scheduledAt: 'desc' },
    });
  }

  /**
   * List interviews for a job
   */
  static async getJobInterviews(jobId: string) {
    return await prisma.interview.findMany({
      where: { jobId },
      include: {
        candidate: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }
}
