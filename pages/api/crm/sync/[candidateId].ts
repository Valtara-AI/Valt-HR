// pages/api/crm/sync/[candidateId].ts - Sync candidate to CRM systems
import type { NextApiRequest, NextApiResponse } from 'next';
import { CRMService } from '../../../../lib/services/crm.service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { candidateId } = req.query;

  if (!candidateId || typeof candidateId !== 'string') {
    return res.status(400).json({ error: 'Candidate ID required' });
  }

  try {
    const { systems } = req.body; // Optional: ['workday', 'greenhouse', 'bamboohr']

    if (systems && Array.isArray(systems)) {
      // Sync to specific systems
      const results: { workday?: string; greenhouse?: string; bamboohr?: string; errors: string[] } = { errors: [] };

      for (const system of systems) {
        try {
          switch (system) {
            case 'workday':
              results.workday = await CRMService.syncToWorkday(candidateId);
              break;
            case 'greenhouse':
              results.greenhouse = await CRMService.syncToGreenhouse(candidateId);
              break;
            case 'bamboohr':
              results.bamboohr = await CRMService.syncToBambooHR(candidateId);
              break;
            default:
              results.errors.push(`Unknown system: ${system}`);
          }
        } catch (error) {
          results.errors.push(
            `${system}: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      }

      return res.status(200).json({
        success: results.errors.length === 0,
        results,
      });
    } else {
      // Sync to all configured systems
      const results = await CRMService.syncToAllSystems(candidateId);

      return res.status(200).json({
        success: results.errors.length === 0,
        results,
      });
    }
  } catch (error) {
    console.error('CRM sync error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
