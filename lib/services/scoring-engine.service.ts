// lib/services/scoring-engine.service.ts - Enhanced scoring engine with fuzzy matching, synonyms, and audit trail

import { ParsedResumeData } from './resume-parser.service';

// ============================================
// SKILL SYNONYMS DATABASE
// ============================================
export const SKILL_SYNONYMS: Record<string, string[]> = {
  // Programming Languages
  'javascript': ['js', 'ecmascript', 'es6', 'es2015', 'es2020', 'es2021', 'es2022', 'vanilla js'],
  'typescript': ['ts', 'typescriptlang'],
  'python': ['py', 'python3', 'python2', 'cpython'],
  'java': ['java8', 'java11', 'java17', 'java21', 'openjdk', 'jdk'],
  'csharp': ['c#', '.net', 'dotnet', 'asp.net', 'c sharp'],
  'cpp': ['c++', 'cplusplus', 'c plus plus'],
  'golang': ['go', 'go-lang'],
  'ruby': ['ruby on rails', 'ror', 'rails'],
  'php': ['php7', 'php8', 'laravel', 'symfony'],
  'swift': ['swiftui', 'ios swift'],
  'kotlin': ['kotlin android', 'kotlinx'],
  'rust': ['rustlang'],
  'scala': ['scala lang', 'akka'],

  // Frontend Frameworks
  'react': ['reactjs', 'react.js', 'react js', 'react native', 'react-native'],
  'angular': ['angularjs', 'angular.js', 'angular 2', 'angular 12', 'angular 15', 'angular 17'],
  'vue': ['vuejs', 'vue.js', 'vue 3', 'nuxt', 'nuxtjs'],
  'svelte': ['sveltekit', 'svelte kit'],
  'nextjs': ['next.js', 'next js', 'vercel next'],

  // Backend Frameworks
  'nodejs': ['node.js', 'node js', 'node', 'express', 'expressjs', 'express.js', 'nestjs', 'nest.js', 'fastify'],
  'django': ['django rest', 'drf', 'django rest framework'],
  'flask': ['flask python'],
  'spring': ['spring boot', 'springboot', 'spring framework', 'spring mvc'],
  'rails': ['ruby on rails', 'ror'],

  // Databases
  'postgresql': ['postgres', 'psql', 'pg'],
  'mysql': ['mariadb', 'mysql 8'],
  'mongodb': ['mongo', 'mongoose'],
  'redis': ['redis cache', 'redis db'],
  'elasticsearch': ['elastic', 'es', 'elk'],
  'dynamodb': ['dynamo', 'aws dynamodb'],
  'cassandra': ['apache cassandra'],
  'sqlite': ['sqlite3'],

  // Cloud Platforms
  'aws': ['amazon web services', 'amazon aws', 'ec2', 's3', 'lambda', 'aws lambda'],
  'azure': ['microsoft azure', 'azure cloud', 'azure devops'],
  'gcp': ['google cloud', 'google cloud platform', 'gcloud'],
  'kubernetes': ['k8s', 'kube', 'k8'],
  'docker': ['containerization', 'docker compose', 'dockerfile'],
  'terraform': ['tf', 'infrastructure as code', 'iac'],

  // DevOps & CI/CD
  'jenkins': ['jenkins ci', 'jenkins pipeline'],
  'github actions': ['gh actions', 'github ci'],
  'gitlab ci': ['gitlab-ci', 'gitlab pipeline'],
  'circleci': ['circle ci'],
  'ansible': ['ansible automation'],

  // Data & ML
  'machine learning': ['ml', 'machine-learning', 'deep learning', 'dl'],
  'tensorflow': ['tf', 'keras'],
  'pytorch': ['torch'],
  'pandas': ['python pandas'],
  'numpy': ['np', 'python numpy'],
  'scikit-learn': ['sklearn', 'sci-kit learn'],
  'data science': ['data analysis', 'data analytics'],
  'sql': ['structured query language', 'sql queries', 'sql server', 't-sql', 'pl/sql'],

  // Soft Skills
  'leadership': ['team lead', 'team leader', 'tech lead', 'technical lead', 'managing teams'],
  'communication': ['verbal communication', 'written communication', 'presentation skills'],
  'problem solving': ['analytical thinking', 'critical thinking', 'troubleshooting'],
  'agile': ['scrum', 'kanban', 'agile methodology', 'sprint planning', 'scrum master'],
  'project management': ['pm', 'pmp', 'project manager'],
};

// ============================================
// EDUCATION NORMALIZATION
// ============================================
export const EDUCATION_LEVELS: Record<string, { rank: number; aliases: string[] }> = {
  'phd': { rank: 100, aliases: ['doctorate', 'doctor of philosophy', 'ph.d', 'ph.d.', 'doctoral', 'dphil'] },
  'master': { rank: 90, aliases: ['masters', 'ms', 'm.s.', 'msc', 'm.sc', 'ma', 'm.a.', 'mba', 'm.b.a.', 'meng', 'm.eng', 'med', 'mfa'] },
  'bachelor': { rank: 80, aliases: ['bachelors', 'bs', 'b.s.', 'bsc', 'b.sc', 'ba', 'b.a.', 'beng', 'b.eng', 'btech', 'b.tech', 'undergraduate'] },
  'associate': { rank: 70, aliases: ['associates', 'aa', 'a.a.', 'as', 'a.s.', 'aas', 'community college'] },
  'diploma': { rank: 60, aliases: ['certification', 'certificate', 'professional diploma', 'technical diploma', 'vocational'] },
  'high school': { rank: 50, aliases: ['hs', 'secondary', 'high school diploma', 'ged', 'hsc', 'a-levels', 'a levels'] },
};

// ============================================
// AUDIT LOG TYPES
// ============================================
export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: 'SCORE_CALCULATED' | 'SCORE_OVERRIDE' | 'ENRICHMENT_COMPLETED' | 'BACKGROUND_CHECK' | 'RED_FLAG_DETECTED' | 'MANUAL_REVIEW';
  actor: {
    type: 'SYSTEM' | 'USER' | 'API';
    id: string;
    name?: string;
  };
  candidateId: string;
  applicationId?: string;
  previousValue?: any;
  newValue?: any;
  reason?: string;
  metadata?: Record<string, any>;
}

// ============================================
// ENHANCED SCORING RESULT
// ============================================
export interface EnhancedScoringResult {
  resumeScore: number;
  breakdown: {
    skills: {
      score: number;
      weight: number;
      weightedScore: number;
      matchedSkills: string[];
      missingSkills: string[];
      synonymMatches: Array<{ required: string; matched: string; synonym: string }>;
      explanation: string;
    };
    experience: {
      score: number;
      weight: number;
      weightedScore: number;
      totalYears: number;
      requiredYears: number;
      relevantPositions: number;
      explanation: string;
    };
    education: {
      score: number;
      weight: number;
      weightedScore: number;
      highestDegree: string;
      normalizedLevel: string;
      fieldMatch: boolean;
      explanation: string;
    };
    other: {
      score: number;
      weight: number;
      weightedScore: number;
      factors: Array<{ factor: string; points: number; present: boolean }>;
      explanation: string;
    };
  };
  category: {
    level: string;
    description: string;
    color: string;
    priority: number;
  };
  redFlags: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    evidence?: string;
  }>;
  provenance: {
    algorithmVersion: string;
    scoredAt: Date;
    scoredBy: string;
    dataSourceVersion: string;
    isOverridden: boolean;
    overrideHistory?: Array<{
      previousScore: number;
      newScore: number;
      overriddenBy: string;
      overriddenAt: Date;
      reason: string;
    }>;
  };
  confidence: number; // 0-100, how confident the system is in this score
  recommendations: string[];
}

// ============================================
// SCORING WEIGHTS
// ============================================
export interface ScoringWeights {
  skills: number;
  experience: number;
  education: number;
  other: number;
}

export interface JobRequirements {
  requiredSkills?: string[];
  preferredSkills?: string[];
  minExperience?: number;
  maxExperience?: number;
  education?: {
    degreeLevel?: string;
    fieldRequired?: boolean;
    preferredFields?: string[];
  };
  certifications?: string[];
}

// ============================================
// ENHANCED SCORING SERVICE
// ============================================
export class EnhancedScoringService {
  private static readonly ALGORITHM_VERSION = '2.0.0';
  private static readonly DATA_SOURCE_VERSION = '2024.11';
  
  private static readonly defaultWeights: ScoringWeights = {
    skills: 40,
    experience: 30,
    education: 20,
    other: 10,
  };

  // ============================================
  // FUZZY MATCHING UTILITIES
  // ============================================
  
  /**
   * Calculate Levenshtein distance between two strings
   */
  private static levenshteinDistance(s1: string, s2: string): number {
    const m = s1.length;
    const n = s2.length;
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (s1[i - 1] === s2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
    }

    return dp[m][n];
  }

  /**
   * Calculate similarity ratio (0-1)
   */
  private static similarityRatio(s1: string, s2: string): number {
    const maxLen = Math.max(s1.length, s2.length);
    if (maxLen === 0) return 1;
    const distance = this.levenshteinDistance(s1, s2);
    return 1 - distance / maxLen;
  }

  /**
   * Check if two skills match (fuzzy + synonyms)
   */
  private static skillsMatch(candidateSkill: string, requiredSkill: string): { 
    matches: boolean; 
    matchType: 'exact' | 'fuzzy' | 'synonym' | 'partial' | 'none';
    confidence: number;
    synonym?: string;
  } {
    const candNorm = candidateSkill.toLowerCase().trim();
    const reqNorm = requiredSkill.toLowerCase().trim();

    // Exact match
    if (candNorm === reqNorm) {
      return { matches: true, matchType: 'exact', confidence: 100 };
    }

    // Check synonyms FIRST - but use STRICT matching (exact match within synonym group)
    for (const [canonical, synonyms] of Object.entries(SKILL_SYNONYMS)) {
      const allVariants = [canonical, ...synonyms];
      
      // Check if candidate skill exactly matches any variant
      const candMatchesExact = allVariants.some(v => candNorm === v);
      // Or if candidate skill contains variant as a word (with boundaries)
      const candMatchesContains = allVariants.some(v => {
        if (candNorm.includes(v)) {
          // Make sure it's not a substring of another word
          // e.g., "java" should not match in "javascript"
          const idx = candNorm.indexOf(v);
          const beforeChar = idx === 0 ? ' ' : candNorm[idx - 1];
          const afterChar = idx + v.length >= candNorm.length ? ' ' : candNorm[idx + v.length];
          // Check if surrounded by non-alphanumeric or at boundaries
          return !beforeChar.match(/[a-z0-9]/) && !afterChar.match(/[a-z0-9]/);
        }
        return false;
      });
      
      // Check if required skill matches similarly
      const reqMatchesExact = allVariants.some(v => reqNorm === v);
      const reqMatchesContains = allVariants.some(v => {
        if (reqNorm.includes(v)) {
          const idx = reqNorm.indexOf(v);
          const beforeChar = idx === 0 ? ' ' : reqNorm[idx - 1];
          const afterChar = idx + v.length >= reqNorm.length ? ' ' : reqNorm[idx + v.length];
          return !beforeChar.match(/[a-z0-9]/) && !afterChar.match(/[a-z0-9]/);
        }
        return false;
      });

      const candMatches = candMatchesExact || candMatchesContains;
      const reqMatches = reqMatchesExact || reqMatchesContains;

      if (candMatches && reqMatches) {
        return { matches: true, matchType: 'synonym', confidence: 90, synonym: canonical };
      }
    }

    // Partial match - but ONLY if the shorter string is at least 4 chars
    // and the match is substantial (shorter is at least 70% of longer)
    // This prevents "Java" matching "JavaScript"
    const shorter = candNorm.length <= reqNorm.length ? candNorm : reqNorm;
    const longer = candNorm.length > reqNorm.length ? candNorm : reqNorm;
    
    if (shorter.length >= 4 && longer.includes(shorter)) {
      // Check if the length ratio is reasonable (avoid Java/JavaScript problem)
      const lengthRatio = shorter.length / longer.length;
      if (lengthRatio >= 0.7) {
        return { matches: true, matchType: 'partial', confidence: 85 };
      }
    }

    // Also allow partial match if candidate skill starts with required skill or vice versa
    // with reasonable length (e.g., "React" matches "ReactJS" but not "Re")
    if (shorter.length >= 3) {
      if (candNorm.startsWith(reqNorm) || reqNorm.startsWith(candNorm)) {
        const lengthRatio = shorter.length / longer.length;
        if (lengthRatio >= 0.5) {
          return { matches: true, matchType: 'partial', confidence: 80 };
        }
      }
    }

    // Fuzzy match (similarity > 0.8)
    const similarity = this.similarityRatio(candNorm, reqNorm);
    if (similarity >= 0.8) {
      return { matches: true, matchType: 'fuzzy', confidence: Math.round(similarity * 100) };
    }

    return { matches: false, matchType: 'none', confidence: 0 };
  }

  /**
   * Normalize education level to standard format
   */
  private static normalizeEducationLevel(degree: string): { level: string; rank: number } {
    const degreeNorm = degree.toLowerCase().trim();

    for (const [level, { rank, aliases }] of Object.entries(EDUCATION_LEVELS)) {
      if (degreeNorm === level || aliases.some(alias => degreeNorm.includes(alias))) {
        return { level, rank };
      }
    }

    // Default to diploma level if unknown
    return { level: 'unknown', rank: 55 };
  }

  // ============================================
  // MAIN SCORING METHOD
  // ============================================

  /**
   * Score a candidate's resume with full explainability and provenance
   */
  static async scoreResume(
    parsedData: ParsedResumeData,
    jobRequirements: JobRequirements,
    weights: Partial<ScoringWeights> = {},
    options: { 
      scoredBy?: string; 
      applicationId?: string;
      includeRecommendations?: boolean;
    } = {}
  ): Promise<EnhancedScoringResult> {
    const finalWeights = { ...this.defaultWeights, ...weights };
    const scoredBy = options.scoredBy || 'SYSTEM';

    // Calculate individual component scores
    const skillsResult = this.scoreSkills(parsedData.skills || [], jobRequirements.requiredSkills || [], jobRequirements.preferredSkills || []);
    const experienceResult = this.scoreExperience(parsedData.experience || [], jobRequirements.minExperience || 0, jobRequirements.maxExperience);
    const educationResult = this.scoreEducation(parsedData.education || [], jobRequirements.education || {});
    const otherResult = this.scoreOtherFactors(parsedData, jobRequirements);

    // Calculate weighted scores
    const skillsWeighted = (skillsResult.score * finalWeights.skills) / 100;
    const experienceWeighted = (experienceResult.score * finalWeights.experience) / 100;
    const educationWeighted = (educationResult.score * finalWeights.education) / 100;
    const otherWeighted = (otherResult.score * finalWeights.other) / 100;

    const totalScore = Math.round(skillsWeighted + experienceWeighted + educationWeighted + otherWeighted);

    // Detect red flags with severity
    const redFlags = this.detectRedFlagsEnhanced(parsedData);

    // Calculate confidence based on data completeness
    const confidence = this.calculateConfidence(parsedData, skillsResult, experienceResult);

    // Get category with color coding
    const category = this.getEnhancedCategory(totalScore);

    // Generate recommendations
    const recommendations = options.includeRecommendations !== false 
      ? this.generateRecommendations(skillsResult, experienceResult, educationResult, redFlags)
      : [];

    return {
      resumeScore: totalScore,
      breakdown: {
        skills: {
          score: skillsResult.score,
          weight: finalWeights.skills,
          weightedScore: Math.round(skillsWeighted * 10) / 10,
          matchedSkills: skillsResult.matchedSkills,
          missingSkills: skillsResult.missingSkills,
          synonymMatches: skillsResult.synonymMatches,
          explanation: skillsResult.explanation,
        },
        experience: {
          score: experienceResult.score,
          weight: finalWeights.experience,
          weightedScore: Math.round(experienceWeighted * 10) / 10,
          totalYears: experienceResult.totalYears,
          requiredYears: experienceResult.requiredYears,
          relevantPositions: experienceResult.relevantPositions,
          explanation: experienceResult.explanation,
        },
        education: {
          score: educationResult.score,
          weight: finalWeights.education,
          weightedScore: Math.round(educationWeighted * 10) / 10,
          highestDegree: educationResult.highestDegree,
          normalizedLevel: educationResult.normalizedLevel,
          fieldMatch: educationResult.fieldMatch,
          explanation: educationResult.explanation,
        },
        other: {
          score: otherResult.score,
          weight: finalWeights.other,
          weightedScore: Math.round(otherWeighted * 10) / 10,
          factors: otherResult.factors,
          explanation: otherResult.explanation,
        },
      },
      category,
      redFlags,
      provenance: {
        algorithmVersion: this.ALGORITHM_VERSION,
        scoredAt: new Date(),
        scoredBy,
        dataSourceVersion: this.DATA_SOURCE_VERSION,
        isOverridden: false,
      },
      confidence,
      recommendations,
    };
  }

  // ============================================
  // SKILLS SCORING (with fuzzy + synonyms)
  // ============================================

  private static scoreSkills(
    candidateSkills: string[],
    requiredSkills: string[],
    preferredSkills: string[] = []
  ): {
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
    synonymMatches: Array<{ required: string; matched: string; synonym: string }>;
    explanation: string;
  } {
    if (requiredSkills.length === 0) {
      return {
        score: 80,
        matchedSkills: [],
        missingSkills: [],
        synonymMatches: [],
        explanation: 'No specific skills required for this position. Default score applied.',
      };
    }

    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];
    const synonymMatches: Array<{ required: string; matched: string; synonym: string }> = [];
    let totalConfidence = 0;

    for (const required of requiredSkills) {
      let bestMatch: { skill: string; result: { matches: boolean; matchType: 'exact' | 'fuzzy' | 'synonym' | 'partial' | 'none'; confidence: number; synonym?: string } } | null = null;

      for (const candidate of candidateSkills) {
        const result = this.skillsMatch(candidate, required);
        if (result.matches && (!bestMatch || result.confidence > bestMatch.result.confidence)) {
          bestMatch = { skill: candidate, result };
        }
      }

      if (bestMatch) {
        matchedSkills.push(required);
        totalConfidence += bestMatch.result.confidence;
        
        if (bestMatch.result.matchType === 'synonym' && bestMatch.result.synonym) {
          synonymMatches.push({
            required,
            matched: bestMatch.skill,
            synonym: bestMatch.result.synonym,
          });
        }
      } else {
        missingSkills.push(required);
      }
    }

    // Calculate base score from required skills match
    const requiredMatchRate = matchedSkills.length / requiredSkills.length;
    let score = Math.round(requiredMatchRate * 100);

    // Bonus for preferred skills (up to +10)
    if (preferredSkills.length > 0) {
      let preferredMatched = 0;
      for (const preferred of preferredSkills) {
        for (const candidate of candidateSkills) {
          if (this.skillsMatch(candidate, preferred).matches) {
            preferredMatched++;
            break;
          }
        }
      }
      const preferredBonus = Math.min(10, Math.round((preferredMatched / preferredSkills.length) * 10));
      score = Math.min(100, score + preferredBonus);
    }

    // Adjust score based on average match confidence
    if (matchedSkills.length > 0) {
      const avgConfidence = totalConfidence / matchedSkills.length;
      score = Math.round(score * (avgConfidence / 100));
    }

    const explanation = `Matched ${matchedSkills.length}/${requiredSkills.length} required skills (${Math.round(requiredMatchRate * 100)}% match rate). ${synonymMatches.length > 0 ? `${synonymMatches.length} matches via synonyms.` : ''} ${missingSkills.length > 0 ? `Missing: ${missingSkills.slice(0, 3).join(', ')}${missingSkills.length > 3 ? '...' : ''}.` : 'All required skills present.'}`;

    return { score, matchedSkills, missingSkills, synonymMatches, explanation };
  }

  // ============================================
  // EXPERIENCE SCORING (normalized)
  // ============================================

  private static scoreExperience(
    experience: ParsedResumeData['experience'],
    minYears: number,
    maxYears?: number
  ): {
    score: number;
    totalYears: number;
    requiredYears: number;
    relevantPositions: number;
    explanation: string;
  } {
    // Calculate total years with overlap detection
    const sortedExp = [...experience].sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    let totalMonths = 0;
    let lastEndDate: Date | null = null;

    for (const exp of sortedExp) {
      const start = new Date(exp.startDate);
      const end = exp.endDate ? new Date(exp.endDate) : new Date();

      if (lastEndDate && start < lastEndDate) {
        // Overlapping employment - only count non-overlapping portion
        if (end > lastEndDate) {
          const months = (end.getTime() - lastEndDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
          totalMonths += Math.max(0, months);
        }
      } else {
        const months = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30);
        totalMonths += Math.max(0, months);
      }

      if (!lastEndDate || end > lastEndDate) {
        lastEndDate = end;
      }
    }

    const totalYears = Math.round(totalMonths / 12 * 10) / 10;

    // Calculate score
    let score: number;
    let explanation: string;

    if (minYears === 0) {
      score = 80;
      explanation = 'No minimum experience required. Default score applied.';
    } else if (totalYears >= minYears * 1.5) {
      score = 100;
      explanation = `Exceptional: ${totalYears} years exceeds requirement (${minYears}) by 50%+.`;
    } else if (totalYears >= minYears) {
      score = 85 + Math.min(15, Math.round((totalYears - minYears) / minYears * 30));
      explanation = `Meets requirement: ${totalYears} years (required: ${minYears}).`;
    } else if (totalYears >= minYears * 0.75) {
      score = 70;
      explanation = `Slightly below: ${totalYears} years vs ${minYears} required (75% met).`;
    } else if (totalYears >= minYears * 0.5) {
      score = 50;
      explanation = `Below requirement: ${totalYears} years vs ${minYears} required (50% met).`;
    } else {
      score = 30;
      explanation = `Significantly below: ${totalYears} years vs ${minYears} required.`;
    }

    // Penalty for being overqualified (if maxYears specified)
    if (maxYears && totalYears > maxYears) {
      const overBy = totalYears - maxYears;
      const penalty = Math.min(20, Math.round(overBy * 5));
      score = Math.max(60, score - penalty);
      explanation += ` Note: May be overqualified (${overBy.toFixed(1)} years over max).`;
    }

    return {
      score,
      totalYears,
      requiredYears: minYears,
      relevantPositions: experience.length,
      explanation,
    };
  }

  // ============================================
  // EDUCATION SCORING (normalized)
  // ============================================

  private static scoreEducation(
    education: ParsedResumeData['education'],
    requirements: { degreeLevel?: string; fieldRequired?: boolean; preferredFields?: string[] }
  ): {
    score: number;
    highestDegree: string;
    normalizedLevel: string;
    fieldMatch: boolean;
    explanation: string;
  } {
    if (education.length === 0) {
      return {
        score: requirements.degreeLevel ? 40 : 70,
        highestDegree: 'None listed',
        normalizedLevel: 'unknown',
        fieldMatch: false,
        explanation: requirements.degreeLevel 
          ? 'No education listed but degree required. Low score applied.'
          : 'No education listed but not required. Default score applied.',
      };
    }

    // Find highest education level
    let highest = { degree: '', level: 'unknown', rank: 0, field: '' };
    
    for (const edu of education) {
      const normalized = this.normalizeEducationLevel(edu.degree);
      if (normalized.rank > highest.rank) {
        highest = { 
          degree: edu.degree, 
          level: normalized.level, 
          rank: normalized.rank,
          field: edu.field || '',
        };
      }
    }

    let score = highest.rank;
    let fieldMatch = false;
    let explanation = `Highest education: ${highest.degree} (${highest.level} level).`;

    // Check if meets required level
    if (requirements.degreeLevel) {
      const requiredNorm = this.normalizeEducationLevel(requirements.degreeLevel);
      
      if (highest.rank >= requiredNorm.rank) {
        score = Math.min(100, highest.rank + 10);
        explanation += ` Meets or exceeds required ${requirements.degreeLevel} level.`;
      } else {
        const gap = requiredNorm.rank - highest.rank;
        score = Math.max(40, highest.rank - gap);
        explanation += ` Below required ${requirements.degreeLevel} level.`;
      }
    }

    // Check field match
    if (requirements.preferredFields && requirements.preferredFields.length > 0 && highest.field) {
      const fieldNorm = highest.field.toLowerCase();
      fieldMatch = requirements.preferredFields.some(pf => 
        fieldNorm.includes(pf.toLowerCase()) || pf.toLowerCase().includes(fieldNorm)
      );
      
      if (fieldMatch) {
        score = Math.min(100, score + 5);
        explanation += ' Field of study matches preferred fields.';
      }
    }

    return {
      score,
      highestDegree: highest.degree,
      normalizedLevel: highest.level,
      fieldMatch,
      explanation,
    };
  }

  // ============================================
  // OTHER FACTORS SCORING
  // ============================================

  private static scoreOtherFactors(
    parsedData: ParsedResumeData,
    requirements: JobRequirements
  ): {
    score: number;
    factors: Array<{ factor: string; points: number; present: boolean }>;
    explanation: string;
  } {
    const factors: Array<{ factor: string; points: number; present: boolean }> = [];
    let score = 50; // Base score

    // Certifications
    const hasCerts = !!(parsedData.certifications && parsedData.certifications.length > 0);
    factors.push({ factor: 'Professional certifications', points: 20, present: hasCerts });
    if (hasCerts) score += 20;

    // LinkedIn profile
    const hasLinkedIn = !!parsedData.personalInfo?.linkedinUrl;
    factors.push({ factor: 'LinkedIn profile', points: 10, present: hasLinkedIn });
    if (hasLinkedIn) score += 10;

    // Professional summary
    const hasSummary = !!(parsedData.summary && parsedData.summary.length > 100);
    factors.push({ factor: 'Professional summary (100+ chars)', points: 10, present: hasSummary });
    if (hasSummary) score += 10;

    // Portfolio/website - not available in current ParsedResumeData type
    const hasPortfolio = false;
    factors.push({ factor: 'Portfolio/website', points: 5, present: hasPortfolio });
    if (hasPortfolio) score += 5;

    // Complete contact info
    const hasCompleteContact = parsedData.personalInfo?.email && parsedData.personalInfo?.phone;
    factors.push({ factor: 'Complete contact information', points: 5, present: !!hasCompleteContact });
    if (hasCompleteContact) score += 5;

    const presentCount = factors.filter(f => f.present).length;
    const explanation = `${presentCount}/${factors.length} additional factors present. ${factors.filter(f => f.present).map(f => f.factor).join(', ') || 'None'}.`;

    return {
      score: Math.min(100, score),
      factors,
      explanation,
    };
  }

  // ============================================
  // ENHANCED RED FLAG DETECTION
  // ============================================

  private static detectRedFlagsEnhanced(parsedData: ParsedResumeData): Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    evidence?: string;
  }> {
    const flags: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high';
      description: string;
      evidence?: string;
    }> = [];

    const experience = parsedData.experience || [];
    const sortedExp = [...experience].sort((a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    // Employment gaps
    for (let i = 1; i < sortedExp.length; i++) {
      const prevEnd = sortedExp[i - 1].endDate ? new Date(sortedExp[i - 1].endDate!) : new Date();
      const currentStart = new Date(sortedExp[i].startDate);
      const gapMonths = (currentStart.getTime() - prevEnd.getTime()) / (1000 * 60 * 60 * 24 * 30);

      if (gapMonths > 24) {
        flags.push({
          type: 'EMPLOYMENT_GAP',
          severity: 'high',
          description: `${Math.round(gapMonths)} month employment gap detected`,
          evidence: `Between ${sortedExp[i - 1].company} and ${sortedExp[i].company}`,
        });
      } else if (gapMonths > 12) {
        flags.push({
          type: 'EMPLOYMENT_GAP',
          severity: 'medium',
          description: `${Math.round(gapMonths)} month employment gap detected`,
          evidence: `Between ${sortedExp[i - 1].company} and ${sortedExp[i].company}`,
        });
      }
    }

    // Short tenure pattern
    const shortStints = sortedExp.filter(exp => {
      if (!exp.endDate) return false;
      const months = (new Date(exp.endDate).getTime() - new Date(exp.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30);
      return months < 12;
    });

    if (shortStints.length >= 4) {
      flags.push({
        type: 'JOB_HOPPING',
        severity: 'high',
        description: 'Pattern of frequent job changes detected',
        evidence: `${shortStints.length} positions lasting less than 1 year`,
      });
    } else if (shortStints.length >= 2) {
      flags.push({
        type: 'SHORT_TENURE',
        severity: 'medium',
        description: 'Multiple short-tenure positions',
        evidence: `${shortStints.length} positions lasting less than 1 year`,
      });
    }

    // Missing critical information
    if (!parsedData.personalInfo?.phone) {
      flags.push({
        type: 'MISSING_INFO',
        severity: 'low',
        description: 'Phone number not provided',
      });
    }

    if (!parsedData.personalInfo?.email) {
      flags.push({
        type: 'MISSING_INFO',
        severity: 'high',
        description: 'Email address not provided',
      });
    }

    // No recent experience
    if (sortedExp.length > 0) {
      const lastExp = sortedExp[sortedExp.length - 1];
      if (lastExp.endDate) {
        const monthsSinceLastJob = (new Date().getTime() - new Date(lastExp.endDate).getTime()) / (1000 * 60 * 60 * 24 * 30);
        if (monthsSinceLastJob > 12) {
          flags.push({
            type: 'CAREER_GAP',
            severity: 'medium',
            description: 'Not currently employed',
            evidence: `Last position ended ${Math.round(monthsSinceLastJob)} months ago`,
          });
        }
      }
    }

    // Overlapping employment (potential data inconsistency)
    for (let i = 0; i < sortedExp.length - 1; i++) {
      const currentEnd = sortedExp[i].endDate ? new Date(sortedExp[i].endDate!) : new Date();
      const nextStart = new Date(sortedExp[i + 1].startDate);
      
      if (currentEnd > nextStart) {
        const overlapMonths = (currentEnd.getTime() - nextStart.getTime()) / (1000 * 60 * 60 * 24 * 30);
        if (overlapMonths > 3) { // More than 3 months overlap
          flags.push({
            type: 'DATE_INCONSISTENCY',
            severity: 'low',
            description: 'Overlapping employment dates',
            evidence: `${sortedExp[i].company} and ${sortedExp[i + 1].company} overlap by ${Math.round(overlapMonths)} months`,
          });
        }
      }
    }

    return flags;
  }

  // ============================================
  // CATEGORY CLASSIFICATION
  // ============================================

  private static getEnhancedCategory(score: number): {
    level: string;
    description: string;
    color: string;
    priority: number;
  } {
    if (score >= 90) {
      return { level: 'Exceptional', description: 'Exceptional fit - Prioritize for interview', color: '#22c55e', priority: 1 };
    }
    if (score >= 75) {
      return { level: 'Strong', description: 'Strong candidate - Recommend for interview', color: '#3b82f6', priority: 2 };
    }
    if (score >= 60) {
      return { level: 'Qualified', description: 'Qualified with gaps - Consider with reservations', color: '#f59e0b', priority: 3 };
    }
    return { level: 'Not Qualified', description: 'Below minimum requirements', color: '#ef4444', priority: 4 };
  }

  // ============================================
  // CONFIDENCE CALCULATION
  // ============================================

  private static calculateConfidence(
    parsedData: ParsedResumeData,
    skillsResult: { matchedSkills: string[]; missingSkills: string[] },
    experienceResult: { totalYears: number }
  ): number {
    let confidence = 50; // Base confidence

    // Data completeness factors
    if (parsedData.personalInfo?.email) confidence += 5;
    if (parsedData.personalInfo?.phone) confidence += 5;
    if (parsedData.skills && parsedData.skills.length > 0) confidence += 10;
    if (parsedData.experience && parsedData.experience.length > 0) confidence += 10;
    if (parsedData.education && parsedData.education.length > 0) confidence += 5;
    if (parsedData.summary && parsedData.summary.length > 50) confidence += 5;

    // Skill matching confidence
    const totalSkills = skillsResult.matchedSkills.length + skillsResult.missingSkills.length;
    if (totalSkills > 0) {
      const matchRate = skillsResult.matchedSkills.length / totalSkills;
      if (matchRate > 0.5) confidence += 5;
    }

    // Experience data quality
    if (experienceResult.totalYears > 0) confidence += 5;

    return Math.min(100, confidence);
  }

  // ============================================
  // RECOMMENDATIONS GENERATION
  // ============================================

  private static generateRecommendations(
    skillsResult: { missingSkills: string[] },
    experienceResult: { score: number; totalYears: number; requiredYears: number },
    educationResult: { score: number },
    redFlags: Array<{ severity: string }>
  ): string[] {
    const recommendations: string[] = [];

    // Skills recommendations
    if (skillsResult.missingSkills.length > 0) {
      const missing = skillsResult.missingSkills.slice(0, 3);
      recommendations.push(`Consider candidates with ${missing.join(', ')} skills or provide training`);
    }

    // Experience recommendations
    if (experienceResult.score < 70 && experienceResult.totalYears < experienceResult.requiredYears) {
      recommendations.push(`Candidate has ${experienceResult.totalYears} years vs ${experienceResult.requiredYears} required - assess growth potential`);
    }

    // Education recommendations
    if (educationResult.score < 70) {
      recommendations.push('Education below typical requirements - verify through practical assessment');
    }

    // Red flag recommendations
    const highSeverityFlags = redFlags.filter(f => f.severity === 'high');
    if (highSeverityFlags.length > 0) {
      recommendations.push(`${highSeverityFlags.length} high-severity red flag(s) detected - manual review recommended`);
    }

    return recommendations;
  }

  // ============================================
  // SCORE OVERRIDE (with audit)
  // ============================================

  static overrideScore(
    originalResult: EnhancedScoringResult,
    newScore: number,
    overriddenBy: string,
    reason: string
  ): EnhancedScoringResult {
    const override = {
      previousScore: originalResult.resumeScore,
      newScore,
      overriddenBy,
      overriddenAt: new Date(),
      reason,
    };

    return {
      ...originalResult,
      resumeScore: newScore,
      category: this.getEnhancedCategory(newScore),
      provenance: {
        ...originalResult.provenance,
        isOverridden: true,
        overrideHistory: [
          ...(originalResult.provenance.overrideHistory || []),
          override,
        ],
      },
    };
  }

  // ============================================
  // LEGACY COMPATIBILITY
  // ============================================

  static getScoreCategory(score: number): { category: string; description: string } {
    const enhanced = this.getEnhancedCategory(score);
    return { category: enhanced.level, description: enhanced.description };
  }
}
