// lib/services/background-check.service.ts - Background validation adapter

export type BackgroundCheckStatus = 
  | 'pending'
  | 'in_progress'
  | 'clear'
  | 'concerns'
  | 'failed'
  | 'expired'
  | 'manual_review';

export type BackgroundCheckType = 
  | 'identity'
  | 'employment'
  | 'education'
  | 'criminal'
  | 'credit'
  | 'reference'
  | 'comprehensive';

export interface BackgroundCheckResult {
  checkId: string;
  candidateId: string;
  type: BackgroundCheckType;
  status: BackgroundCheckStatus;
  provider: 'checkr' | 'trulioo' | 'sterling' | 'manual';
  requestedAt: Date;
  completedAt?: Date;
  expiresAt?: Date;
  results?: {
    verified: boolean;
    findings: BackgroundCheckFinding[];
    summary: string;
  };
  rawResponse?: unknown;
  manualVerificationRequired: boolean;
  manualVerificationNotes?: string;
}

export interface BackgroundCheckFinding {
  category: string;
  description: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  source: string;
  verifiedAt?: Date;
  actionRequired: boolean;
  recommendation?: string;
}

export interface BackgroundCheckRequest {
  candidateId: string;
  candidateEmail: string;
  candidateName: string;
  candidatePhone?: string;
  candidateDOB?: string; // ISO date
  types: BackgroundCheckType[];
  consent: {
    provided: boolean;
    timestamp: Date;
    ipAddress?: string;
    method: 'electronic' | 'paper' | 'verbal';
  };
  additionalInfo?: {
    ssn?: string; // For US candidates
    driversLicense?: string;
    previousAddresses?: string[];
    previousEmployers?: Array<{
      company: string;
      title: string;
      startDate: string;
      endDate?: string;
    }>;
    educationHistory?: Array<{
      institution: string;
      degree: string;
      graduationYear: number;
    }>;
  };
}

/**
 * Background Check Service
 * 
 * Integrates with background check providers:
 * - Checkr: Popular for tech companies
 * - Sterling: Enterprise solution
 * - Trulioo: Global identity verification
 * 
 * All checks require explicit candidate consent (FCRA compliance in US)
 */
export class BackgroundCheckService {
  private static readonly CHECKR_API = process.env.CHECKR_API_KEY;
  private static readonly CHECKR_API_BASE = 'https://api.checkr.com/v1';
  
  private static readonly TRULIOO_API = process.env.TRULIOO_API_KEY;
  private static readonly TRULIOO_API_BASE = 'https://gateway.trulioo.com';
  
  private static readonly STERLING_API = process.env.STERLING_API_KEY;

  /**
   * Initiate a background check
   */
  static async initiateCheck(request: BackgroundCheckRequest): Promise<BackgroundCheckResult> {
    // Validate consent
    if (!request.consent.provided) {
      throw new Error('Background check requires explicit candidate consent');
    }

    // Generate check ID
    const checkId = this.generateCheckId();

    // Determine which provider to use
    const provider = this.selectProvider(request.types);

    try {
      let result: BackgroundCheckResult;

      switch (provider) {
        case 'checkr':
          result = await this.initiateCheckrCheck(checkId, request);
          break;
        case 'trulioo':
          result = await this.initiateTruliooCheck(checkId, request);
          break;
        case 'sterling':
          result = await this.initiateSterlingCheck(checkId, request);
          break;
        default:
          // Fall back to manual verification
          result = this.createManualCheck(checkId, request);
      }

      // Log the check initiation for audit
      await this.logCheckEvent(result, 'initiated', request.consent);

      return result;
    } catch (error) {
      console.error('Background check error:', error);
      throw error;
    }
  }

  /**
   * Get status of a background check
   */
  static async getCheckStatus(checkId: string): Promise<BackgroundCheckResult | null> {
    // In production, this would:
    // 1. Look up the check in our database
    // 2. If pending/in_progress, poll the provider
    // 3. Return the latest status
    
    console.log(`[Background Check] Getting status for: ${checkId}`);
    
    // Mock implementation for development
    return null;
  }

  /**
   * Handle webhook callback from background check provider
   */
  static async handleWebhook(
    provider: string,
    payload: unknown
  ): Promise<{ processed: boolean; checkId?: string; status?: BackgroundCheckStatus }> {
    console.log(`[Background Check] Webhook from ${provider}:`, payload);
    
    // In production:
    // 1. Validate webhook signature
    // 2. Parse provider-specific payload
    // 3. Update check status in database
    // 4. Trigger notifications if needed
    // 5. Update candidate pipeline stage if clear
    
    return { processed: true };
  }

  /**
   * Initiate check via Checkr
   */
  private static async initiateCheckrCheck(
    checkId: string,
    request: BackgroundCheckRequest
  ): Promise<BackgroundCheckResult> {
    if (!this.CHECKR_API) {
      console.log('[Checkr] API key not configured, falling back to manual');
      return this.createManualCheck(checkId, request);
    }

    // Map our types to Checkr packages
    const checkrPackage = this.mapToCheckrPackage(request.types);

    try {
      // Step 1: Create candidate in Checkr
      // const candidateResponse = await fetch(`${this.CHECKR_API_BASE}/candidates`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Basic ${Buffer.from(this.CHECKR_API + ':').toString('base64')}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     email: request.candidateEmail,
      //     first_name: request.candidateName.split(' ')[0],
      //     last_name: request.candidateName.split(' ').slice(1).join(' '),
      //     phone: request.candidatePhone,
      //     dob: request.candidateDOB
      //   })
      // });

      // Step 2: Create invitation
      // const invitationResponse = await fetch(`${this.CHECKR_API_BASE}/invitations`, {
      //   method: 'POST',
      //   headers: { ... },
      //   body: JSON.stringify({
      //     candidate_id: candidateId,
      //     package: checkrPackage
      //   })
      // });

      console.log(`[Checkr] Would initiate ${checkrPackage} check for ${request.candidateEmail}`);
      
      // Return pending result
      return {
        checkId,
        candidateId: request.candidateId,
        type: request.types.includes('comprehensive') ? 'comprehensive' : request.types[0],
        status: 'pending',
        provider: 'checkr',
        requestedAt: new Date(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        manualVerificationRequired: false,
      };
    } catch (error) {
      console.error('[Checkr] Error:', error);
      throw new Error('Failed to initiate Checkr background check');
    }
  }

  /**
   * Initiate check via Trulioo
   */
  private static async initiateTruliooCheck(
    checkId: string,
    request: BackgroundCheckRequest
  ): Promise<BackgroundCheckResult> {
    if (!this.TRULIOO_API) {
      console.log('[Trulioo] API key not configured, falling back to manual');
      return this.createManualCheck(checkId, request);
    }

    try {
      // Trulioo is primarily for identity verification
      // const response = await fetch(`${this.TRULIOO_API_BASE}/verifications/v1/verify`, {
      //   method: 'POST',
      //   headers: {
      //     'x-trulioo-api-key': this.TRULIOO_API,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     AcceptTruliooTermsAndConditions: true,
      //     VerboseMode: true,
      //     DataFields: {
      //       PersonInfo: {
      //         FirstGivenName: request.candidateName.split(' ')[0],
      //         FirstSurName: request.candidateName.split(' ').slice(1).join(' ')
      //       },
      //       Communication: {
      //         EmailAddress: request.candidateEmail,
      //         Telephone: request.candidatePhone
      //       }
      //     }
      //   })
      // });

      console.log(`[Trulioo] Would initiate identity verification for ${request.candidateEmail}`);

      return {
        checkId,
        candidateId: request.candidateId,
        type: 'identity',
        status: 'pending',
        provider: 'trulioo',
        requestedAt: new Date(),
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        manualVerificationRequired: false,
      };
    } catch (error) {
      console.error('[Trulioo] Error:', error);
      throw new Error('Failed to initiate Trulioo verification');
    }
  }

  /**
   * Initiate check via Sterling
   */
  private static async initiateSterlingCheck(
    checkId: string,
    request: BackgroundCheckRequest
  ): Promise<BackgroundCheckResult> {
    if (!this.STERLING_API) {
      console.log('[Sterling] API key not configured, falling back to manual');
      return this.createManualCheck(checkId, request);
    }

    // Sterling implementation would go here
    console.log(`[Sterling] Would initiate check for ${request.candidateEmail}`);

    return {
      checkId,
      candidateId: request.candidateId,
      type: request.types[0],
      status: 'pending',
      provider: 'sterling',
      requestedAt: new Date(),
      manualVerificationRequired: false,
    };
  }

  /**
   * Create a manual verification check
   */
  private static createManualCheck(
    checkId: string,
    request: BackgroundCheckRequest
  ): BackgroundCheckResult {
    return {
      checkId,
      candidateId: request.candidateId,
      type: request.types[0],
      status: 'manual_review',
      provider: 'manual',
      requestedAt: new Date(),
      manualVerificationRequired: true,
      manualVerificationNotes: `Manual verification required for: ${request.types.join(', ')}. No automated provider configured.`,
    };
  }

  /**
   * Select the best provider based on check types
   */
  private static selectProvider(types: BackgroundCheckType[]): 'checkr' | 'trulioo' | 'sterling' | 'manual' {
    // Priority: Checkr for comprehensive, Trulioo for identity-only, Sterling for enterprise
    if (types.includes('comprehensive') || types.includes('criminal') || types.includes('employment')) {
      if (this.CHECKR_API) return 'checkr';
      if (this.STERLING_API) return 'sterling';
    }
    
    if (types.length === 1 && types[0] === 'identity') {
      if (this.TRULIOO_API) return 'trulioo';
    }

    if (this.CHECKR_API) return 'checkr';
    if (this.TRULIOO_API) return 'trulioo';
    if (this.STERLING_API) return 'sterling';
    
    return 'manual';
  }

  /**
   * Map our check types to Checkr package names
   */
  private static mapToCheckrPackage(types: BackgroundCheckType[]): string {
    if (types.includes('comprehensive')) {
      return 'driver_pro'; // Most comprehensive
    }
    if (types.includes('criminal') && types.includes('employment')) {
      return 'pro_criminal';
    }
    if (types.includes('criminal')) {
      return 'basic_criminal';
    }
    if (types.includes('employment')) {
      return 'employment';
    }
    if (types.includes('education')) {
      return 'education';
    }
    return 'basic_criminal'; // Default
  }

  /**
   * Generate unique check ID
   */
  private static generateCheckId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `chk_${timestamp}_${random}`;
  }

  /**
   * Log check event for audit trail
   */
  private static async logCheckEvent(
    check: BackgroundCheckResult,
    event: string,
    consent: BackgroundCheckRequest['consent']
  ): Promise<void> {
    const logEntry = {
      checkId: check.checkId,
      candidateId: check.candidateId,
      event,
      provider: check.provider,
      status: check.status,
      consent: {
        provided: consent.provided,
        timestamp: consent.timestamp,
        method: consent.method,
      },
      timestamp: new Date(),
    };

    console.log('[Background Check Audit]', JSON.stringify(logEntry, null, 2));
    
    // In production, this would be stored in database
    // await prisma.backgroundCheckAuditLog.create({ data: logEntry });
  }

  /**
   * Verify employment history manually
   */
  static async verifyEmployment(
    employerInfo: {
      company: string;
      title: string;
      startDate: string;
      endDate?: string;
      contactEmail?: string;
      contactPhone?: string;
    }
  ): Promise<{
    verified: boolean;
    verificationMethod: 'email' | 'phone' | 'database' | 'unverified';
    notes: string;
  }> {
    // This would integrate with employment verification services like:
    // - The Work Number (Equifax)
    // - Truework
    // - Manual outreach
    
    console.log(`[Employment Verification] Would verify: ${employerInfo.company} - ${employerInfo.title}`);
    
    return {
      verified: false,
      verificationMethod: 'unverified',
      notes: 'Employment verification requires manual contact with employer',
    };
  }

  /**
   * Verify education credentials
   */
  static async verifyEducation(
    educationInfo: {
      institution: string;
      degree: string;
      graduationYear: number;
    }
  ): Promise<{
    verified: boolean;
    verificationMethod: 'nsc' | 'direct' | 'database' | 'unverified';
    notes: string;
  }> {
    // This would integrate with:
    // - National Student Clearinghouse (NSC)
    // - Direct institution verification
    // - Parchment/diploma verification services
    
    console.log(`[Education Verification] Would verify: ${educationInfo.degree} from ${educationInfo.institution}`);
    
    return {
      verified: false,
      verificationMethod: 'unverified',
      notes: 'Education verification requires National Student Clearinghouse query or direct institution contact',
    };
  }
}
