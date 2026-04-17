# Example: Connecting Resume Processing UI to Backend

This shows how to update the `resume-processing-view.tsx` component to use real backend APIs.

## Original Code (Mock Data)

```tsx
const recentApplications = [
  {
    id: "APP-001",
    name: "Sarah Chen",
    position: "Senior Developer",
    status: "parsed",
    score: 94,
    // ... mock data
  }
];
```

## Updated Code (Real API)

```tsx
import { useEffect, useState } from "react";
import { apiClient } from "@/services/apiClient";

export function ResumeProcessingView({ onOpenModal }: ResumeProcessingProps) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingStatus, setProcessingStatus] = useState("idle");

  // Fetch real applications from backend
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    const response = await apiClient.getPipelineStatus();
    
    if (response.success && response.data) {
      // Transform backend data to component format
      const formattedApps = response.data.candidatesByStage.screening.map((candidate: any) => ({
        id: candidate.applicationId,
        name: candidate.name,
        position: candidate.jobTitle,
        status: candidate.applicationStatus,
        score: candidate.score,
        duplicates: 0, // Calculate from backend if available
        errors: 0,
        timestamp: new Date(candidate.appliedAt).toLocaleString()
      }));
      
      setApplications(formattedApps);
    } else {
      toast.error("Failed to load applications");
    }
    
    setLoading(false);
  };

  // Handle batch processing using real API
  const handleProcessBatch = async () => {
    setProcessingStatus("processing");
    toast.info("Processing new applications...", {
      description: "Parsing resumes and validating data"
    });
    
    const response = await apiClient.batchProcessAssessments(50);
    
    if (response.success) {
      setProcessingStatus("completed");
      toast.success("Batch processing completed!", {
        description: `${response.data?.processed || 0} applications processed`
      });
      
      // Reload applications
      loadApplications();
    } else {
      setProcessingStatus("error");
      toast.error("Batch processing failed", {
        description: response.error
      });
    }
  };

  // Handle resume upload
  const handleResumeUpload = async (file: File, jobId: number) => {
    const response = await apiClient.uploadResume(
      file,
      jobId,
      "candidate@example.com", // Get from form
      "Candidate Name" // Get from form
    );

    if (response.success) {
      toast.success("Resume uploaded successfully!");
      loadApplications(); // Refresh list
    } else {
      toast.error("Upload failed", { description: response.error });
    }
  };

  if (loading) {
    return <div>Loading applications...</div>;
  }

  return (
    // ... rest of component with real data
    <Table>
      <TableBody>
        {applications.map((app) => (
          <TableRow key={app.id}>
            <TableCell>{app.name}</TableCell>
            <TableCell>{app.position}</TableCell>
            <TableCell>{getStatusBadge(app.status)}</TableCell>
            <TableCell>{app.score}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

## Key Changes

1. **Import API Client**
   ```tsx
   import { apiClient } from "@/services/apiClient";
   ```

2. **Add State Management**
   ```tsx
   const [applications, setApplications] = useState([]);
   const [loading, setLoading] = useState(true);
   ```

3. **Fetch Real Data**
   ```tsx
   useEffect(() => {
     loadApplications();
   }, []);
   ```

4. **Use API Methods**
   - `apiClient.getPipelineStatus()` - Get applications
   - `apiClient.uploadResume()` - Upload new resume
   - `apiClient.batchProcessAssessments()` - Process batch

5. **Handle Loading & Errors**
   - Show loading state
   - Display error messages
   - Refresh data after mutations

## Apply This Pattern to Other Components

### `analytics-view.tsx`
```tsx
const response = await apiClient.getRecruitmentMetrics(startDate, endDate);
```

### `candidate-evaluation-view.tsx`
```tsx
const response = await apiClient.getCandidateScore(candidateId);
```

### `assessments-view.tsx`
```tsx
const response = await apiClient.createAssessment({
  candidateId,
  jobId,
  type: 'phase1'
});
```

### `ai-interviews-view.tsx`
```tsx
const response = await apiClient.startPhoneInterview({
  candidateId,
  jobId,
  phoneNumber
});
```

### `scheduling-view.tsx`
```tsx
const response = await apiClient.checkAvailability(
  interviewerEmail,
  startDate,
  endDate
);
```

## Testing Your Changes

1. **Start the backend:**
   ```bash
   npm run dev
   ```

2. **Open browser console** to see API requests

3. **Test each feature:**
   - Upload a resume
   - View applications list
   - Process batch
   - Check for errors in console

4. **Handle errors gracefully:**
   ```tsx
   if (!response.success) {
     console.error('API Error:', response.error);
     toast.error(response.error || 'Something went wrong');
     return;
   }
   ```

## Next Steps

1. Update all components in `src/components/` to use `apiClient`
2. Remove all mock data
3. Add proper TypeScript types for API responses
4. Implement error boundaries
5. Add retry logic for failed requests
6. Add loading skeletons for better UX
