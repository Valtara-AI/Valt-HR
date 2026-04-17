// pages/api/applications/upload-resume.ts - Resume upload and processing endpoint
import formidable, { IncomingForm } from 'formidable';
import fs from 'fs/promises';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/db';
import { candidateScoringQueue } from '../../../lib/queue';
import { NotificationService } from '../../../lib/services/notification.service';
import { ResumeParserService } from '../../../lib/services/resume-parser.service';

export const config = {
  api: {
    bodyParser: false, // Disable body parsing for file uploads
  },
};

interface UploadResponse {
  success: boolean;
  application?: {
    id: string;
    candidateId: string;
    stage: string;
  };
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UploadResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Parse multipart form data
    const form = new IncomingForm({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keepExtensions: true,
    });

    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const jobId = Array.isArray(fields.jobId) ? fields.jobId[0] : fields.jobId;
    const resumeFile = Array.isArray(files.resume) ? files.resume[0] : files.resume;

    if (!jobId || !resumeFile) {
      return res.status(400).json({ success: false, error: 'Job ID and resume file required' });
    }

    // Read file
    const fileBuffer = await fs.readFile(resumeFile.filepath);
    const fileName = resumeFile.originalFilename || 'resume.pdf';

    // Parse resume (this could be moved to background job)
    console.log('Parsing resume...');
    const parsedData = await ResumeParserService.parseResume(fileBuffer, fileName);

    // Validate parsed data
    const validation = ResumeParserService.validateParsedData(parsedData);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: `Resume validation failed: ${validation.errors.join(', ')}`,
      });
    }

    // Check for duplicate
    const duplicateId = await ResumeParserService.checkDuplicate(
      parsedData.personalInfo.email,
      parsedData.personalInfo.phone
    );

    if (duplicateId) {
      // Check if already applied to this job
      const existingApp = await prisma.application.findUnique({
        where: {
          candidateId_jobId: {
            candidateId: duplicateId,
            jobId,
          },
        },
      });

      if (existingApp) {
        return res.status(409).json({
          success: false,
          error: 'You have already applied to this position',
        });
      }

      // Create new application for existing candidate
      const application = await prisma.application.create({
        data: {
          candidateId: duplicateId,
          jobId,
          stage: 'resume-scoring',
          resumeParsed: true,
          duplicateChecked: true,
        },
      });

      // Trigger scoring job
      await candidateScoringQueue.add('score-candidate', {
        applicationId: application.id,
        candidateId: duplicateId,
        jobId,
      });

      return res.status(200).json({
        success: true,
        application: {
          id: application.id,
          candidateId: duplicateId,
          stage: application.stage,
        },
      });
    }

    // Create new candidate
    const candidate = await prisma.candidate.create({
      data: {
        email: parsedData.personalInfo.email,
        firstName: parsedData.personalInfo.firstName,
        lastName: parsedData.personalInfo.lastName,
        phone: parsedData.personalInfo.phone,
        location: parsedData.personalInfo.location,
        linkedinUrl: parsedData.personalInfo.linkedinUrl,
        resumeParsedData: parsedData as any,
        skills: parsedData.skills,
        experience: parsedData.experience as any,
        education: parsedData.education as any,
        source: 'job-board', // Could be dynamic
      },
    });

    // Create application
    const application = await prisma.application.create({
      data: {
        candidateId: candidate.id,
        jobId,
        stage: 'resume-scoring',
        resumeParsed: true,
        duplicateChecked: true,
        isDuplicate: false,
        validationErrors: validation.errors.length > 0 ? validation.errors : null,
      },
    });

    // Queue scoring job (async)
    await candidateScoringQueue.add('score-candidate', {
      applicationId: application.id,
      candidateId: candidate.id,
      jobId,
    });

    // Send confirmation email (async - don't await)
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (job) {
      NotificationService.sendApplicationConfirmation(
        candidate.email,
        `${candidate.firstName} ${candidate.lastName}`,
        job.title
      ).catch(err => console.error('Failed to send confirmation email:', err));
    }

    return res.status(201).json({
      success: true,
      application: {
        id: application.id,
        candidateId: candidate.id,
        stage: application.stage,
      },
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
