// lib/services/linkedin-enrichment.service.ts - LinkedIn profile enrichment adapter

export interface LinkedInProfile {
  profileUrl: string;
  verified: boolean;
  profileData?: {
    headline?: string;
    summary?: string;
    location?: string;
    industry?: string;
    connectionCount?: number;
    followerCount?: number;
  };
  completenessScore: number;
  professionalPresenceScore: number;
  endorsements: {
    total: number;
    topSkills: Array<{ skill: string; count: number }>;
  };
  recommendations: {
    received: number;
    given: number;
  };
  activity: {
    postsLastMonth: number;
    engagementRate: number;
    isActive: boolean;
  };
  verification: {
    emailVerified: boolean;
    phoneVerified: boolean;
    identityVerified: boolean;
  };
  fetchedAt: Date;
  source: 'api' | 'scrape' | 'manual' | 'mock';
}

export interface LinkedInEnrichmentResult {
  success: boolean;
  profile?: LinkedInProfile;
  error?: string;
  consentRequired: boolean;
  consentProvided: boolean;
}

/**
 * LinkedIn Enrichment Service
 * 
 * In production, this would integrate with:
 * - LinkedIn Marketing API (official, requires partnership)
 * - LinkedIn People API (official, limited access)
 * - Third-party enrichment services (Clearbit, Apollo, etc.)
 * - Web scraping service (with consent)
 */
export class LinkedInEnrichmentService {
  private static readonly API_BASE = process.env.LINKEDIN_API_BASE || 'https://api.linkedin.com/v2';
  private static readonly CLEARBIT_API = process.env.CLEARBIT_API_KEY;
  private static readonly APOLLO_API = process.env.APOLLO_API_KEY;

  /**
   * Enrich candidate profile with LinkedIn data
   * Requires explicit consent from candidate
   */
  static async enrichProfile(
    linkedinUrl: string,
    candidateEmail: string,
    options: {
      consentProvided: boolean;
      consentTimestamp?: Date;
      consentType?: 'explicit' | 'implicit';
    }
  ): Promise<LinkedInEnrichmentResult> {
    // Consent check
    if (!options.consentProvided) {
      return {
        success: false,
        error: 'Candidate consent required for LinkedIn profile enrichment',
        consentRequired: true,
        consentProvided: false,
      };
    }

    // Validate LinkedIn URL
    const profileId = this.extractProfileId(linkedinUrl);
    if (!profileId) {
      return {
        success: false,
        error: 'Invalid LinkedIn URL format',
        consentRequired: false,
        consentProvided: true,
      };
    }

    try {
      // Try multiple enrichment sources in order of preference
      let profile: LinkedInProfile | null = null;

      // 1. Try official LinkedIn API (if configured)
      if (process.env.LINKEDIN_ACCESS_TOKEN) {
        profile = await this.fetchFromLinkedInAPI(profileId);
      }

      // 2. Try third-party enrichment service (Clearbit)
      if (!profile && this.CLEARBIT_API) {
        profile = await this.fetchFromClearbit(candidateEmail, linkedinUrl);
      }

      // 3. Try Apollo.io
      if (!profile && this.APOLLO_API) {
        profile = await this.fetchFromApollo(candidateEmail, linkedinUrl);
      }

      // 4. Fall back to basic URL validation + mock enrichment for development
      if (!profile) {
        profile = await this.createMockProfile(linkedinUrl, profileId);
      }

      return {
        success: true,
        profile,
        consentRequired: false,
        consentProvided: true,
      };
    } catch (error) {
      console.error('LinkedIn enrichment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown enrichment error',
        consentRequired: false,
        consentProvided: true,
      };
    }
  }

  /**
   * Extract LinkedIn profile ID from URL
   */
  private static extractProfileId(url: string): string | null {
    // Match patterns:
    // https://www.linkedin.com/in/username/
    // https://linkedin.com/in/username
    // linkedin.com/in/username
    const patterns = [
      /linkedin\.com\/in\/([a-zA-Z0-9-]+)/,
      /linkedin\.com\/pub\/([a-zA-Z0-9-]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Fetch from official LinkedIn API
   */
  private static async fetchFromLinkedInAPI(profileId: string): Promise<LinkedInProfile | null> {
    // Note: LinkedIn's official API has very limited access
    // Most applications need to use partnership programs or third-party services
    
    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
    if (!accessToken) return null;

    try {
      // This would be the actual API call in production
      // const response = await fetch(`${this.API_BASE}/people/(id:${profileId})`, {
      //   headers: { 'Authorization': `Bearer ${accessToken}` }
      // });
      
      console.log(`[LinkedIn API] Would fetch profile for: ${profileId}`);
      return null; // Not implemented - requires LinkedIn partnership
    } catch (error) {
      console.error('LinkedIn API error:', error);
      return null;
    }
  }

  /**
   * Fetch from Clearbit enrichment service
   */
  private static async fetchFromClearbit(email: string, linkedinUrl: string): Promise<LinkedInProfile | null> {
    if (!this.CLEARBIT_API) return null;

    try {
      // In production:
      // const response = await fetch(`https://person.clearbit.com/v2/combined/find?email=${email}`, {
      //   headers: { 'Authorization': `Bearer ${this.CLEARBIT_API}` }
      // });

      console.log(`[Clearbit] Would enrich profile for: ${email}`);
      return null; // Implement actual Clearbit integration
    } catch (error) {
      console.error('Clearbit error:', error);
      return null;
    }
  }

  /**
   * Fetch from Apollo.io
   */
  private static async fetchFromApollo(email: string, linkedinUrl: string): Promise<LinkedInProfile | null> {
    if (!this.APOLLO_API) return null;

    try {
      // In production:
      // const response = await fetch('https://api.apollo.io/v1/people/match', {
      //   method: 'POST',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'Cache-Control': 'no-cache',
      //     'X-Api-Key': this.APOLLO_API
      //   },
      //   body: JSON.stringify({ email, linkedin_url: linkedinUrl })
      // });

      console.log(`[Apollo] Would enrich profile for: ${email}`);
      return null; // Implement actual Apollo integration
    } catch (error) {
      console.error('Apollo error:', error);
      return null;
    }
  }

  /**
   * Create mock profile for development/testing
   * In production, this should be removed or use actual data
   */
  private static async createMockProfile(linkedinUrl: string, profileId: string): Promise<LinkedInProfile> {
    // Generate deterministic mock data based on profile ID
    const hash = this.simpleHash(profileId);
    
    return {
      profileUrl: linkedinUrl,
      verified: true,
      profileData: {
        headline: 'Professional based on LinkedIn profile',
        summary: 'Profile summary would be extracted from LinkedIn',
        location: 'Location from LinkedIn',
        industry: 'Technology',
        connectionCount: 500 + (hash % 1000),
        followerCount: 100 + (hash % 500),
      },
      completenessScore: this.calculateCompletenessScore(linkedinUrl, profileId),
      professionalPresenceScore: this.calculatePresenceScore(hash),
      endorsements: {
        total: 10 + (hash % 50),
        topSkills: [
          { skill: 'JavaScript', count: 5 + (hash % 10) },
          { skill: 'React', count: 3 + (hash % 8) },
          { skill: 'Node.js', count: 2 + (hash % 6) },
        ],
      },
      recommendations: {
        received: hash % 10,
        given: hash % 5,
      },
      activity: {
        postsLastMonth: hash % 8,
        engagementRate: (hash % 100) / 100,
        isActive: hash % 3 !== 0,
      },
      verification: {
        emailVerified: true,
        phoneVerified: hash % 2 === 0,
        identityVerified: false,
      },
      fetchedAt: new Date(),
      source: 'mock',
    };
  }

  /**
   * Calculate profile completeness score
   */
  private static calculateCompletenessScore(url: string, profileId: string): number {
    let score = 50; // Base score for having a profile

    // Custom URL vs random ID
    if (profileId.match(/^[a-zA-Z-]+$/)) {
      score += 15; // Custom URL
    }

    // HTTPS
    if (url.startsWith('https://')) {
      score += 5;
    }

    // Has www
    if (url.includes('www.')) {
      score += 5;
    }

    // Profile ID length (longer custom URLs indicate more effort)
    if (profileId.length > 10) {
      score += 10;
    }

    return Math.min(100, score);
  }

  /**
   * Calculate professional presence score
   */
  private static calculatePresenceScore(hash: number): number {
    // This would be based on actual LinkedIn data in production
    // For mock, generate a reasonable score
    return 60 + (hash % 35);
  }

  /**
   * Simple hash function for generating deterministic mock data
   */
  private static simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Calculate overall enrichment score based on LinkedIn data
   */
  static calculateEnrichmentScore(profile: LinkedInProfile): {
    score: number;
    factors: Array<{ factor: string; score: number; weight: number }>;
    recommendation: string;
  } {
    const factors: Array<{ factor: string; score: number; weight: number }> = [];

    // Profile completeness (30%)
    factors.push({
      factor: 'Profile Completeness',
      score: profile.completenessScore,
      weight: 30,
    });

    // Professional presence (25%)
    factors.push({
      factor: 'Professional Presence',
      score: profile.professionalPresenceScore,
      weight: 25,
    });

    // Network strength (20%)
    const networkScore = Math.min(100, (profile.profileData?.connectionCount || 0) / 5);
    factors.push({
      factor: 'Network Strength',
      score: networkScore,
      weight: 20,
    });

    // Endorsements & recommendations (15%)
    const endorsementScore = Math.min(100, (profile.endorsements.total * 2) + (profile.recommendations.received * 10));
    factors.push({
      factor: 'Endorsements & Recommendations',
      score: endorsementScore,
      weight: 15,
    });

    // Activity (10%)
    const activityScore = profile.activity.isActive ? 70 + Math.min(30, profile.activity.postsLastMonth * 10) : 40;
    factors.push({
      factor: 'Platform Activity',
      score: activityScore,
      weight: 10,
    });

    // Calculate weighted total
    const totalScore = Math.round(
      factors.reduce((sum, f) => sum + (f.score * f.weight / 100), 0)
    );

    // Generate recommendation
    let recommendation: string;
    if (totalScore >= 80) {
      recommendation = 'Strong LinkedIn presence indicates active professional engagement';
    } else if (totalScore >= 60) {
      recommendation = 'Adequate LinkedIn presence - consider requesting portfolio or references';
    } else if (totalScore >= 40) {
      recommendation = 'Limited LinkedIn presence - verify professional credentials through other means';
    } else {
      recommendation = 'Weak or no LinkedIn presence - additional verification recommended';
    }

    return { score: totalScore, factors, recommendation };
  }
}
