// lib/services/scoring.service.ts - Candidate evaluation and scoring
import { ParsedResumeData } from './resume-parser.service';

export interface ScoringWeights {
  skills: number;      // 40%
  experience: number;  // 30%
  education: number;   // 20%
  other: number;       // 10%
}

export interface JobRequirements {
  requiredSkills?: string[];
  minExperience?: number;
  education?: {
    degreeLevel?: string;
    fieldRequired?: boolean;
  };
}

export interface ScoringResult {
  resumeScore: number;  // 0-100
  breakdown: {
    skillsScore: number;
    experienceScore: number;
    educationScore: number;
    otherScore: number;
  };
  redFlags: string[];
}

export class ScoringService {
  private static defaultWeights: ScoringWeights = {
    skills: 40,
    experience: 30,
    education: 20,
    other: 10,
  };

  /**
   * Score a candidate's resume against job requirements
   */
  static async scoreResume(
    parsedData: ParsedResumeData,
    jobRequirements: JobRequirements,
    weights?: Partial<ScoringWeights>
  ): Promise<ScoringResult> {
    const finalWeights = { ...this.defaultWeights, ...weights };

    // Calculate individual scores
    const skillsScore = this.scoreSkills(parsedData.skills, jobRequirements.requiredSkills || []);
    const experienceScore = this.scoreExperience(parsedData.experience, jobRequirements.minExperience || 0);
    const educationScore = this.scoreEducation(parsedData.education, jobRequirements.education || {});
    const otherScore = this.scoreOther(parsedData);

    // Calculate weighted total
    const resumeScore = Math.round(
      (skillsScore * finalWeights.skills / 100) +
      (experienceScore * finalWeights.experience / 100) +
      (educationScore * finalWeights.education / 100) +
      (otherScore * finalWeights.other / 100)
    );

    // Detect red flags
    const redFlags = this.detectRedFlags(parsedData);

    return {
      resumeScore,
      breakdown: {
        skillsScore,
        experienceScore,
        educationScore,
        otherScore,
      },
      redFlags,
    };
  }

  /**
   * Score skills match (0-100)
   */
  private static scoreSkills(candidateSkills: string[], requiredSkills: string[]): number {
    if (requiredSkills.length === 0) return 80; // Default if no requirements

    const normalizedCandidate = candidateSkills.map(s => s.toLowerCase());
    const normalizedRequired = requiredSkills.map(s => s.toLowerCase());

    const matchedSkills = normalizedRequired.filter(req =>
      normalizedCandidate.some(cand => cand.includes(req) || req.includes(cand))
    );

    const matchPercentage = (matchedSkills.length / normalizedRequired.length) * 100;
    return Math.min(100, matchPercentage);
  }

  /**
   * Score experience (0-100)
   */
  private static scoreExperience(experience: ParsedResumeData['experience'], minYears: number): number {
    const totalYears = experience.reduce((sum, exp) => {
      const start = new Date(exp.startDate);
      const end = exp.endDate ? new Date(exp.endDate) : new Date();
      const years = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
      return sum + years;
    }, 0);

    if (minYears === 0) return 80; // No minimum required

    if (totalYears >= minYears * 1.5) return 100; // 50% more than required
    if (totalYears >= minYears) return 85;
    if (totalYears >= minYears * 0.75) return 70;
    if (totalYears >= minYears * 0.5) return 50;
    return 30;
  }

  /**
   * Score education (0-100)
   */
  private static scoreEducation(
    education: ParsedResumeData['education'],
    requirements: { degreeLevel?: string; fieldRequired?: boolean }
  ): number {
    if (education.length === 0) return requirements.degreeLevel ? 40 : 70;

    const degreeScores: Record<string, number> = {
      'phd': 100,
      'doctorate': 100,
      'master': 90,
      'bachelor': 80,
      'associate': 70,
      'diploma': 60,
    };

    const highestDegree = education.reduce((highest, edu) => {
      const level = edu.degree.toLowerCase();
      const score = degreeScores[level] || 50;
      return Math.max(highest, score);
    }, 0);

    return highestDegree;
  }

  /**
   * Score other factors (certifications, summary quality, etc.)
   */
  private static scoreOther(parsedData: ParsedResumeData): number {
    let score = 50; // Base score

    if (parsedData.certifications && parsedData.certifications.length > 0) {
      score += 20;
    }

    if (parsedData.summary && parsedData.summary.length > 100) {
      score += 15;
    }

    if (parsedData.personalInfo.linkedinUrl) {
      score += 15;
    }

    return Math.min(100, score);
  }

  /**
   * Detect red flags in candidate data
   */
  private static detectRedFlags(parsedData: ParsedResumeData): string[] {
    const flags: string[] = [];

    // Employment gaps > 1 year
    const sortedExp = [...parsedData.experience].sort((a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    for (let i = 1; i < sortedExp.length; i++) {
      const prevEnd = sortedExp[i - 1].endDate ? new Date(sortedExp[i - 1].endDate!) : new Date();
      const currentStart = new Date(sortedExp[i].startDate);
      const gapMonths = (currentStart.getTime() - prevEnd.getTime()) / (1000 * 60 * 60 * 24 * 30);

      if (gapMonths > 12) {
        flags.push(`Employment gap of ${Math.round(gapMonths)} months detected`);
      }
    }

    // Short tenure (multiple jobs < 1 year)
    const shortStints = parsedData.experience.filter(exp => {
      if (!exp.endDate) return false;
      const months = (new Date(exp.endDate).getTime() - new Date(exp.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30);
      return months < 12;
    });

    if (shortStints.length >= 3) {
      flags.push('Multiple short-tenure positions (< 1 year)');
    }

    // Missing contact info
    if (!parsedData.personalInfo.phone) {
      flags.push('Missing phone number');
    }

    return flags;
  }

  /**
   * Social media audit - LinkedIn profile analysis
   */
  static async auditSocialMedia(linkedinUrl?: string, candidateEmail?: string): Promise<{
    score: number;
    verified: boolean;
    profileQuality: string;
    recommendations: string[];
  }> {
    if (!linkedinUrl) {
      return {
        score: 50,
        verified: false,
        profileQuality: 'No LinkedIn profile provided',
        recommendations: ['Add LinkedIn profile to improve professional presence score'],
      };
    }

    // Validate LinkedIn URL format
    const isValidLinkedIn = linkedinUrl.includes('linkedin.com/in/');
    if (!isValidLinkedIn) {
      return {
        score: 40,
        verified: false,
        profileQuality: 'Invalid LinkedIn URL format',
        recommendations: ['Provide valid LinkedIn profile URL'],
      };
    }

    // TODO: Integrate with LinkedIn API or scraping service
    // For now, basic URL validation and scoring
    let score = 70; // Base score for having a profile
    const recommendations: string[] = [];

    // Check if URL is public (not a private profile ID)
    if (linkedinUrl.match(/\/in\/[a-zA-Z-]+\//)) {
      score += 10;
    } else {
      recommendations.push('LinkedIn profile appears to use ID instead of custom URL');
    }

    // In production, would check:
    // - Profile completeness (photo, summary, experience)
    // - Number of connections
    // - Endorsements and recommendations
    // - Activity and posts
    // - Profile views

    return {
      score: Math.min(100, score),
      verified: true,
      profileQuality: score >= 80 ? 'Strong' : score >= 60 ? 'Adequate' : 'Weak',
      recommendations,
    };
  }

  /**
   * Cross-reference employment history for inconsistencies
   */
  static async validateEmploymentHistory(experience: ParsedResumeData['experience']): Promise<{
    verified: boolean;
    inconsistencies: string[];
    gapsDetected: boolean;
    overlapDetected: boolean;
  }> {
    const inconsistencies: string[] = [];
    let gapsDetected = false;
    let overlapDetected = false;

    // Sort by start date
    const sortedExperience = [...experience].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    for (let i = 0; i < sortedExperience.length - 1; i++) {
      const current = sortedExperience[i];
      const next = sortedExperience[i + 1];

      const currentEnd = current.endDate ? new Date(current.endDate) : new Date();
      const nextStart = new Date(next.startDate);

      // Check for gaps > 6 months
      const gapMonths = (nextStart.getTime() - currentEnd.getTime()) / (1000 * 60 * 60 * 24 * 30);
      if (gapMonths > 6) {
        gapsDetected = true;
        inconsistencies.push(
          `${Math.round(gapMonths)} month gap between ${current.company} and ${next.company}`
        );
      }

      // Check for overlapping employment
      if (currentEnd > nextStart) {
        overlapDetected = true;
        inconsistencies.push(
          `Overlapping dates: ${current.company} and ${next.company}`
        );
      }

      // Check for very short tenures (< 6 months)
      if (current.endDate) {
        const tenureMonths = (currentEnd.getTime() - new Date(current.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30);
        if (tenureMonths < 6) {
          inconsistencies.push(
            `Very short tenure at ${current.company} (${Math.round(tenureMonths)} months)`
          );
        }
      }
    }

    return {
      verified: inconsistencies.length === 0,
      inconsistencies,
      gapsDetected,
      overlapDetected,
    };
  }

  /**
   * Background check initiation (integrate with Checkr, HireRight, etc.)
   */
  static async initiateBackgroundCheck(candidateId: string, checkType: 'basic' | 'comprehensive' = 'basic'): Promise<{
    checkId: string;
    status: string;
    estimatedCompletion: Date;
  }> {
    // TODO: Integrate with background check service API
    // Example services: Checkr, HireRight, Sterling
    
    console.log(`Background check initiated for candidate ${candidateId} (${checkType})`);

    return {
      checkId: `BGC-${Date.now()}-${candidateId}`,
      status: 'pending',
      estimatedCompletion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    };
  }

  /**
   * Get score category
   */
  static getScoreCategory(score: number): { category: string; description: string } {
    if (score >= 90) return { category: 'Exceptional', description: 'Exceptional fit - Prioritize' };
    if (score >= 75) return { category: 'Strong', description: 'Strong candidate - Interview' };
    if (score >= 60) return { category: 'Qualified', description: 'Qualified with gaps - Consider' };
    return { category: 'Not Qualified', description: 'Below requirements' };
  }
}
