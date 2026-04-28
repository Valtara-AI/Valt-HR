// lib/services/crm.service.ts - CRM Integration Service (Phase 6)
import axios from 'axios';
import prisma from '../db';

interface CRMCandidate {
  externalId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  jobTitle: string;
  status: string;
  source: string;
  skills?: string[];
  experience?: any[];
  education?: any[];
}

export class CRMService {
  /**
   * Sync candidate to Workday
   */
  static async syncToWorkday(candidateId: string): Promise<string> {
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: {
        applications: {
          include: { job: true },
        },
      },
    });

    if (!candidate) {
      throw new Error('Candidate not found');
    }

    if (!process.env.WORKDAY_API_URL || !process.env.WORKDAY_API_KEY) {
      console.warn('Workday credentials not configured');
      return 'workday-sync-skipped';
    }

    try {
      // Map candidate to Workday format
      const workdayPayload = {
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        email: candidate.email,
        phone: candidate.phone,
        location: candidate.location,
        candidateSource: candidate.source,
        skills: candidate.skills,
        resumeText: JSON.stringify(candidate.resumeParsedData),
        
        // Workday-specific fields
        jobRequisitions: candidate.applications.map((app: any) => ({ // Added : any
          requisitionId: app.job?.externalId || 'N/A',
          status: app.stage,
        })),
      };

      const response = await axios.post(
        `${process.env.WORKDAY_API_URL}/candidates`,
        workdayPayload,
        {
          headers: {
            Authorization: `Bearer ${process.env.WORKDAY_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      const externalId = response.data.id || response.data.candidateId;

      // Log sync
      await prisma.cRMSync.create({
        data: {
          candidateId,
          system: 'workday',
          externalId,
          syncType: 'candidate-create',
          status: 'success',
          syncedAt: new Date(),
        },
      });

      return externalId;
    } catch (error) {
      console.error('Workday sync error:', error);

      await prisma.cRMSync.create({
        data: {
          candidateId,
          system: 'workday',
          syncType: 'candidate-create',
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          syncedAt: new Date(),
        },
      });

      throw error;
    }
  }

  /**
   * Sync candidate to Greenhouse
   */
  static async syncToGreenhouse(candidateId: string): Promise<string> {
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: {
        applications: {
          include: { job: true },
        },
      },
    });

    if (!candidate) {
      throw new Error('Candidate not found');
    }

    if (!process.env.GREENHOUSE_API_KEY) {
      console.warn('Greenhouse credentials not configured');
      return 'greenhouse-sync-skipped';
    }

    try {
      // Greenhouse API requires job_id for candidate creation
      const application = candidate.applications[0];
      if (!application) {
        throw new Error('No application found for candidate');
      }

      const greenhousePayload = {
        first_name: candidate.firstName,
        last_name: candidate.lastName,
        company: null,
        title: null,
        phone_numbers: candidate.phone
          ? [{ value: candidate.phone, type: 'mobile' }]
          : [],
        addresses: candidate.location
          ? [{ value: candidate.location, type: 'home' }]
          : [],
        email_addresses: [{ value: candidate.email, type: 'personal' }],
        website_addresses: candidate.linkedinUrl
          ? [{ value: candidate.linkedinUrl, type: 'linkedin' }]
          : [],
        social_media_addresses: [],
        applications: [
          {
            job_id: application.job.id,
            source_id: null,
            referrer: null,
            custom_fields: candidate.skills?.map((skill) => ({
              name: 'Skills',
              value: skill,
            })),
          },
        ],
      };

      const response = await axios.post(
        'https://harvest.greenhouse.io/v1/candidates',
        greenhousePayload,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(process.env.GREENHOUSE_API_KEY + ':').toString('base64')}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      const externalId = response.data.id.toString();

      await prisma.cRMSync.create({
        data: {
          candidateId,
          system: 'greenhouse',
          externalId,
          syncType: 'candidate-create',
          status: 'success',
          syncedAt: new Date(),
        },
      });

      return externalId;
    } catch (error) {
      console.error('Greenhouse sync error:', error);

      await prisma.cRMSync.create({
        data: {
          candidateId,
          system: 'greenhouse',
          syncType: 'candidate-create',
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          syncedAt: new Date(),
        },
      });

      throw error;
    }
  }

  /**
   * Sync candidate to BambooHR
   */
  static async syncToBambooHR(candidateId: string): Promise<string> {
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      throw new Error('Candidate not found');
    }

    if (!process.env.BAMBOOHR_API_KEY || !process.env.BAMBOOHR_SUBDOMAIN) {
      console.warn('BambooHR credentials not configured');
      return 'bamboohr-sync-skipped';
    }

    try {
      const bambooPayload = {
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        email: candidate.email,
        mobilePhone: candidate.phone,
        city: candidate.location,
      };

      const response = await axios.post(
        `https://api.bamboohr.com/api/gateway.php/${process.env.BAMBOOHR_SUBDOMAIN}/v1/applicants`,
        bambooPayload,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(process.env.BAMBOOHR_API_KEY + ':x').toString('base64')}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      const externalId = response.headers['location']?.split('/').pop() || 'unknown';

      await prisma.cRMSync.create({
        data: {
          candidateId,
          system: 'bamboohr',
          externalId,
          syncType: 'candidate-create',
          status: 'success',
          syncedAt: new Date(),
        },
      });

      return externalId;
    } catch (error) {
      console.error('BambooHR sync error:', error);

      await prisma.cRMSync.create({
        data: {
          candidateId,
          system: 'bamboohr',
          syncType: 'candidate-create',
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          syncedAt: new Date(),
        },
      });

      throw error;
    }
  }

  /**
   * Sync candidate to all configured CRM systems
   */
  static async syncToAllSystems(candidateId: string): Promise<{
    workday?: string;
    greenhouse?: string;
    bamboohr?: string;
    errors: string[];
  }> {
    const results: any = { errors: [] };

    // Sync to Workday
    if (process.env.WORKDAY_API_URL && process.env.WORKDAY_API_KEY) {
      try {
        results.workday = await this.syncToWorkday(candidateId);
      } catch (error) {
        results.errors.push(`Workday: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Sync to Greenhouse
    if (process.env.GREENHOUSE_API_KEY) {
      try {
        results.greenhouse = await this.syncToGreenhouse(candidateId);
      } catch (error) {
        results.errors.push(`Greenhouse: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Sync to BambooHR
    if (process.env.BAMBOOHR_API_KEY && process.env.BAMBOOHR_SUBDOMAIN) {
      try {
        results.bamboohr = await this.syncToBambooHR(candidateId);
      } catch (error) {
        results.errors.push(`BambooHR: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return results;
  }

  /**
   * Update candidate status in CRM
   */
  static async updateCandidateStatus(
    candidateId: string,
    status: string
  ): Promise<void> {
    // Get all sync records for this candidate
    const syncRecords = await prisma.cRMSync.findMany({
      where: {
        candidateId,
        status: 'success',
      },
    });

    for (const sync of syncRecords) {
      try {
        switch (sync.system) {
          case 'workday':
            await this.updateWorkdayStatus(sync.externalId!, status);
            break;
          case 'greenhouse':
            await this.updateGreenhouseStatus(sync.externalId!, status);
            break;
          case 'bamboohr':
            await this.updateBambooHRStatus(sync.externalId!, status);
            break;
        }

        await prisma.cRMSync.create({
          data: {
            candidateId,
            system: sync.system,
            externalId: sync.externalId,
            syncType: 'status-update',
            status: 'success',
            payload: { newStatus: status },
            syncedAt: new Date(),
          },
        });
      } catch (error) {
        console.error(`Failed to update ${sync.system} status:`, error);
        
        await prisma.cRMSync.create({
          data: {
            candidateId,
            system: sync.system,
            externalId: sync.externalId,
            syncType: 'status-update',
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error',
            syncedAt: new Date(),
          },
        });
      }
    }
  }

  private static async updateWorkdayStatus(externalId: string, status: string): Promise<void> {
    if (!process.env.WORKDAY_API_URL || !process.env.WORKDAY_API_KEY) return;

    await axios.patch(
      `${process.env.WORKDAY_API_URL}/candidates/${externalId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${process.env.WORKDAY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
  }

  private static async updateGreenhouseStatus(externalId: string, status: string): Promise<void> {
    if (!process.env.GREENHOUSE_API_KEY) return;

    // Map internal status to Greenhouse stage
    const stageMapping: Record<string, string> = {
      'new': 'application_review',
      'assessment-pending': 'assessment',
      'phone-interview': 'phone_screen',
      'final-interview': 'on_site',
      'offer': 'offer',
      'hired': 'hired',
      'rejected': 'rejected',
    };

    await axios.post(
      `https://harvest.greenhouse.io/v1/candidates/${externalId}/advance`,
      { from_stage_id: null, to_stage_id: stageMapping[status] },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(process.env.GREENHOUSE_API_KEY + ':').toString('base64')}`,
        },
      }
    );
  }

  private static async updateBambooHRStatus(externalId: string, status: string): Promise<void> {
    if (!process.env.BAMBOOHR_API_KEY || !process.env.BAMBOOHR_SUBDOMAIN) return;

    await axios.post(
      `https://api.bamboohr.com/api/gateway.php/${process.env.BAMBOOHR_SUBDOMAIN}/v1/applicants/${externalId}/status`,
      { status },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(process.env.BAMBOOHR_API_KEY + ':x').toString('base64')}`,
        },
      }
    );
  }
}
