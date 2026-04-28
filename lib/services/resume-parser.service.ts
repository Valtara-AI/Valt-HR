// lib/services/resume-parser.service.ts - Resume parsing integration
import axios from 'axios';
import prisma from '../db';

export interface ParsedResumeData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    location?: string;
    linkedinUrl?: string;
  };
  skills: string[];
  experience: Array<{
    company: string;
    title: string;
    startDate: string;
    endDate?: string;
    description: string;
    location?: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    graduationDate: string;
    gpa?: string;
  }>;
  summary?: string;
  certifications?: string[];
}

export class ResumeParserService {
  /**
   * Parse resume using third-party API (Affinda example)
   * Can be swapped with Sovren, Rchilli, or custom parser
   */
  static async parseResume(fileBuffer: Buffer, fileName: string): Promise<ParsedResumeData> {
    try {

      const formData = new FormData();
      // Instead of creating a new Uint8Array which might link to a SharedArrayBuffer,
      // use the Buffer's built-in conversion that Blob understands better in this environment.
      const blob = new Blob([fileBuffer], { type: 'application/pdf' });
      formData.append('file', blob as any, fileName);
      
      const response = await axios.post(
        process.env.RESUME_PARSER_API_URL || 'https://api.affinda.com/v3/resume_parser',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${process.env.RESUME_PARSER_API_KEY}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const data = response.data.data;

      // Map Affinda response to our format (adjust based on actual API)
      return {
        personalInfo: {
          firstName: data.name?.first || '',
          lastName: data.name?.last || '',
          email: data.emails?.[0]?.value || '',
          phone: data.phoneNumbers?.[0]?.value,
          location: data.location?.formatted,
          linkedinUrl: data.websites?.find((w: any) => w.type === 'linkedin')?.url,
        },
        skills: data.skills?.map((s: any) => s.name || s) || [],
        experience: data.workExperience?.map((exp: any) => ({
          company: exp.organization || '',
          title: exp.jobTitle || '',
          startDate: exp.dates?.startDate || '',
          endDate: exp.dates?.endDate,
          description: exp.jobDescription || '',
          location: exp.location?.formatted,
        })) || [],
        education: data.education?.map((edu: any) => ({
          institution: edu.organization || '',
          degree: edu.accreditation?.education || '',
          field: edu.accreditation?.educationLevel || '',
          graduationDate: edu.dates?.completionDate || '',
          gpa: edu.grade?.value,
        })) || [],
        summary: data.summary,
        certifications: data.certifications?.map((c: any) => c.name) || [],
      };
    } catch (error: any) {
      console.error('Resume parsing error:', error.response?.data || error.message);
      throw new Error(`Failed to parse resume: ${error.message}`);
    }
  }

  /**
   * Fallback: Simple text extraction parser (no AI)
   * Used when API is unavailable or as backup
   */
  static async parseResumeSimple(text: string): Promise<Partial<ParsedResumeData>> {
    // Basic regex-based extraction
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
    const phoneRegex = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    
    const emails = text.match(emailRegex) || [];
    const phones = text.match(phoneRegex) || [];

    // Extract skills from common keywords
    const skillKeywords = ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'TypeScript'];
    const foundSkills = skillKeywords.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );

    return {
      personalInfo: {
        firstName: '',
        lastName: '',
        email: emails[0] || '',
        phone: phones[0],
      },
      skills: foundSkills,
      experience: [],
      education: [],
    };
  }

  /**
   * Check for duplicate candidates
   */
  static async checkDuplicate(email: string, phone?: string): Promise<string | null> {
    const existing = await prisma.candidate.findFirst({
      where: {
        OR: [
          { email },
          ...(phone ? [{ phone }] : []),
        ],
      },
    });

    return existing?.id || null;
  }

  /**
   * Validate parsed data
   */
  static validateParsedData(data: ParsedResumeData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.personalInfo.email) {
      errors.push('Email is required');
    }

    if (!data.personalInfo.firstName || !data.personalInfo.lastName) {
      errors.push('Full name is required');
    }

    if (data.skills.length === 0) {
      errors.push('No skills detected');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
