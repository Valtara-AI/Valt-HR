/**
 * API Client for HR Workflow Assistant
 * Centralized API calls for frontend components
 */

type APIResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

class APIClient {
  private baseURL = '/api';

  /**
   * Generic GET request
   */
  private async get<T>(endpoint: string): Promise<APIResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`);
      return await response.json();
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error);
      return { success: false, error: 'Network error' };
    }
  }

  /**
   * Generic POST request
   */
  private async post<T>(endpoint: string, body?: any): Promise<APIResponse<T>> {
    try {
      const isFormData = body instanceof FormData;
      
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: isFormData ? {} : { 'Content-Type': 'application/json' },
        body: isFormData ? body : JSON.stringify(body),
      });
      
      return await response.json();
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error);
      return { success: false, error: 'Network error' };
    }
  }

  // ==================== APPLICATIONS ====================

  /**
   * Upload resume for a candidate
   */
  async uploadResume(
    file: File,
    jobId: number,
    candidateEmail: string,
    candidateName: string
  ) {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobId', jobId.toString());
    formData.append('candidateEmail', candidateEmail);
    formData.append('candidateName', candidateName);

    return this.post('/applications/upload-resume', formData);
  }

  // ==================== CANDIDATES ====================

  /**
   * Get all candidates with filtering
   */
  async getCandidates(filters?: {
    scoreMin?: number;
    scoreMax?: number;
    jobId?: string;
    stage?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const params = new URLSearchParams();
    if (filters?.scoreMin) params.append('scoreMin', filters.scoreMin.toString());
    if (filters?.scoreMax) params.append('scoreMax', filters.scoreMax.toString());
    if (filters?.jobId) params.append('jobId', filters.jobId);
    if (filters?.stage) params.append('stage', filters.stage);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const query = params.toString() ? `?${params}` : '';
    return this.get(`/candidates${query}`);
  }

  /**
   * Get candidate details
   */
  async getCandidate(candidateId: string) {
    return this.get(`/candidates/${candidateId}`);
  }

  /**
   * Get candidate score across all applications
   */
  async getCandidateScore(candidateId: string) {
    return this.get(`/candidates/${candidateId}/score`);
  }

  /**
   * Trigger manual scoring for a candidate on a specific job
   */
  async scoreCandidateManually(candidateId: string, jobId: string) {
    return this.post(`/candidates/${candidateId}/score`, { jobId });
  }

  /**
   * Enrich candidate data with social media audit and background validation
   */
  async enrichCandidate(candidateId: string) {
    return this.post(`/candidates/${candidateId}/enrich`);
  }

  // ==================== ASSESSMENTS ====================

  /**
   * Create a new assessment
   */
  async createAssessment(data: {
    candidateId: number;
    jobId: number;
    type: 'phase1' | 'phase2';
    questions?: any[];
  }) {
    return this.post('/assessments/create', data);
  }

  /**
   * Start an assessment
   */
  async startAssessment(assessmentId: number) {
    return this.post(`/assessments/${assessmentId}/start`);
  }

  /**
   * Submit assessment answers
   */
  async submitAssessment(assessmentId: number, answers: any[]) {
    return this.post(`/assessments/${assessmentId}/submit`, { answers });
  }

  /**
   * Evaluate a completed assessment
   */
  async evaluateAssessment(assessmentId: number) {
    return this.post(`/assessments/${assessmentId}/evaluate`);
  }

  /**
   * Batch process assessments
   */
  async batchProcessAssessments(limit?: number) {
    const query = limit ? `?limit=${limit}` : '';
    return this.get(`/assessments/batch-process${query}`);
  }

  // ==================== INTERVIEWS ====================

  /**
   * Schedule a human interview
   */
  async scheduleInterview(data: {
    candidateId: number;
    interviewerId: number;
    scheduledAt: string;
    type: string;
    duration: number;
  }) {
    return this.post('/interviews/schedule', data);
  }

  /**
   * Start an AI phone interview
   */
  async startPhoneInterview(data: {
    candidateId: number;
    jobId: number;
    phoneNumber: string;
  }) {
    return this.post('/interviews/phone/start', data);
  }

  /**
   * Get interview transcript
   */
  async getInterviewTranscript(interviewId: number) {
    return this.get(`/interviews/${interviewId}/transcript`);
  }

  /**
   * Submit interview feedback
   */
  async submitInterviewFeedback(
    interviewId: number,
    data: {
      interviewerId: number;
      ratings: Record<string, number>;
      notes: string;
      recommendation: string;
    }
  ) {
    return this.post(`/interviews/${interviewId}/feedback`, data);
  }

  // ==================== CALENDAR ====================

  /**
   * Check interviewer availability
   */
  async checkAvailability(
    email: string,
    startDate: string,
    endDate: string
  ) {
    const params = new URLSearchParams({
      email,
      startDate,
      endDate,
    });
    return this.get(`/calendar/availability?${params}`);
  }

  /**
   * Create a calendar event
   */
  async createCalendarEvent(data: {
    interviewerEmail: string;
    candidateEmail: string;
    candidateName: string;
    startTime: string;
    duration: number;
    title: string;
    description: string;
  }) {
    return this.post('/calendar/create-event', data);
  }

  // ==================== NOTIFICATIONS ====================

  /**
   * Send a notification
   */
  async sendNotification(data: {
    type: string;
    recipientEmail: string;
    recipientName: string;
    data: Record<string, any>;
  }) {
    return this.post('/notifications/send', data);
  }

  // ==================== CRM ====================

  /**
   * Sync candidate to CRM
   */
  async syncToCRM(candidateId: number, platform: string, action: string) {
    return this.post(`/crm/sync/${candidateId}`, { platform, action });
  }

  // ==================== ONBOARDING ====================

  /**
   * Start onboarding process
   */
  async startOnboarding(data: {
    candidateId: number;
    startDate: string;
    position: string;
    department: string;
    managerId: number;
  }) {
    return this.post('/onboarding/start', data);
  }

  /**
   * Complete an onboarding task
   */
  async completeOnboardingTask(
    onboardingId: number,
    taskId: number,
    data: {
      notes?: string;
      completedBy: string;
    }
  ) {
    return this.post(`/onboarding/${onboardingId}/tasks/${taskId}/complete`, data);
  }

  // ==================== PERFORMANCE ====================

  /**
   * Create a performance review
   */
  async createPerformanceReview(data: {
    employeeId: number;
    reviewerId: number;
    dueDate: string;
    type: string;
  }) {
    return this.post('/performance/reviews/create', data);
  }

  /**
   * Create a performance goal
   */
  async createPerformanceGoal(data: {
    employeeId: number;
    title: string;
    description: string;
    category: string;
    targetDate: string;
  }) {
    return this.post('/performance/goals/create', data);
  }

  // ==================== TALENT DEVELOPMENT ====================

  /**
   * Create a development plan
   */
  async createDevelopmentPlan(data: {
    employeeId: number;
    currentRole: string;
    targetRole: string;
    skillGaps: string[];
    learningPath: any[];
    timeline: string;
  }) {
    return this.post('/talent/development/create-plan', data);
  }

  // ==================== ANALYTICS ====================

  /**
   * Get recruitment metrics
   */
  async getRecruitmentMetrics(startDate?: string, endDate?: string, jobId?: number) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (jobId) params.append('jobId', jobId.toString());
    
    const query = params.toString() ? `?${params}` : '';
    return this.get(`/analytics/recruitment-metrics${query}`);
  }

  /**
   * Get pipeline status
   */
  async getPipelineStatus(jobId?: number) {
    const query = jobId ? `?jobId=${jobId}` : '';
    return this.get(`/analytics/pipeline-status${query}`);
  }

  // ==================== HEALTH CHECK ====================

  /**
   * Check API health
   */
  async healthCheck() {
    return this.get('/health');
  }
}

// Export singleton instance
export const apiClient = new APIClient();

// Export types for TypeScript users
export type { APIResponse };

