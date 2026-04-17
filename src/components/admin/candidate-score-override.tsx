// src/components/admin/candidate-score-override.tsx - Admin UI for score override with audit trail
import {
    AlertCircle,
    CheckCircle,
    History,
    Shield,
    TrendingDown,
    TrendingUp,
    User,
    Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Slider } from '../ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';

// Types
interface ScoreBreakdown {
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
    explanation: string;
  };
  education: {
    score: number;
    weight: number;
    weightedScore: number;
    highestDegree: string;
    normalizedLevel: string;
    explanation: string;
  };
  other: {
    score: number;
    weight: number;
    weightedScore: number;
    factors: Array<{ factor: string; points: number; present: boolean }>;
    explanation: string;
  };
}

interface RedFlag {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  evidence?: string;
}

interface AuditLogEntry {
  id: string;
  action: string;
  previousScore: number | null;
  newScore: number;
  actorType: string;
  actorName: string;
  reason: string | null;
  createdAt: string;
}

interface CandidateScore {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  resumeScore: number;
  breakdown: ScoreBreakdown;
  category: {
    level: string;
    description: string;
  };
  redFlags: RedFlag[];
  provenance: {
    algorithmVersion: string;
    scoredAt: string;
    scoredBy: string;
    isOverridden: boolean;
  };
  confidence: number;
  recommendations: string[];
  scoredAt: string;
}

interface CandidateScoreOverrideProps {
  candidateId: string;
  candidateName: string;
  onClose?: () => void;
  onScoreUpdate?: (newScore: number) => void;
}

export function CandidateScoreOverride({
  candidateId,
  candidateName,
  onClose,
  onScoreUpdate,
}: CandidateScoreOverrideProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [scores, setScores] = useState<CandidateScore[]>([]);
  const [auditHistory, setAuditHistory] = useState<AuditLogEntry[]>([]);
  const [selectedScore, setSelectedScore] = useState<CandidateScore | null>(null);
  
  const [overrideValue, setOverrideValue] = useState<number>(0);
  const [overrideReason, setOverrideReason] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Get current user (in production, from auth context)
  const currentUser = 'Admin User'; // Replace with actual auth

  useEffect(() => {
    fetchScores();
  }, [candidateId]);

  const fetchScores = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/candidates/${candidateId}/score`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch scores');
      }

      setScores(data.data.scores || []);
      setAuditHistory(data.data.auditHistory || []);
      
      if (data.data.scores?.length > 0) {
        setSelectedScore(data.data.scores[0]);
        setOverrideValue(data.data.scores[0].resumeScore);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load score data');
    } finally {
      setLoading(false);
    }
  };

  const handleOverrideSubmit = async () => {
    if (!selectedScore || !overrideReason.trim()) {
      setError('Please provide a reason for the score override');
      return;
    }

    if (overrideReason.length < 10) {
      setError('Reason must be at least 10 characters');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`/api/candidates/${candidateId}/score`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: selectedScore.applicationId,
          newScore: overrideValue,
          reason: overrideReason,
          overriddenBy: currentUser,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to override score');
      }

      setSuccess(`Score updated from ${selectedScore.resumeScore} to ${overrideValue}`);
      setIsEditing(false);
      setOverrideReason('');
      
      // Refresh data
      await fetchScores();
      
      onScoreUpdate?.(overrideValue);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save override');
    } finally {
      setSaving(false);
    }
  };

  const getCategoryColor = (level: string) => {
    switch (level) {
      case 'Exceptional': return 'bg-green-500';
      case 'Strong': return 'bg-blue-500';
      case 'Qualified': return 'bg-yellow-500';
      default: return 'bg-red-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="ml-3 text-gray-600">Loading score data...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Score Management: {candidateName}
            </CardTitle>
            <CardDescription>
              View detailed score breakdown and override if necessary
            </CardDescription>
          </div>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Success</AlertTitle>
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        {scores.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Scores Found</AlertTitle>
            <AlertDescription>
              This candidate has no scored applications yet.
            </AlertDescription>
          </Alert>
        ) : (
          <Tabs defaultValue="breakdown" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="breakdown">Score Breakdown</TabsTrigger>
              <TabsTrigger value="redflags">Red Flags</TabsTrigger>
              <TabsTrigger value="override">Override Score</TabsTrigger>
              <TabsTrigger value="audit">Audit History</TabsTrigger>
            </TabsList>

            {/* Score Breakdown Tab */}
            <TabsContent value="breakdown" className="space-y-4">
              {selectedScore && (
                <>
                  {/* Overall Score */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500">Overall Score</p>
                      <p className="text-4xl font-bold">{selectedScore.resumeScore}</p>
                    </div>
                    <Badge className={`${getCategoryColor(selectedScore.category.level)} text-white px-4 py-2`}>
                      {selectedScore.category.level}
                    </Badge>
                  </div>

                  {/* Confidence and Provenance */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium">Confidence</p>
                      <p className="text-2xl font-bold text-blue-800">{selectedScore.confidence}%</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-600 font-medium">Algorithm</p>
                      <p className="text-lg font-medium text-purple-800">
                        v{selectedScore.provenance.algorithmVersion}
                        {selectedScore.provenance.isOverridden && (
                          <span className="text-sm ml-2 text-orange-600">(overridden)</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="space-y-4">
                    {/* Skills */}
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">Skills ({selectedScore.breakdown.skills.weight}%)</h4>
                        <span className="text-lg font-bold">{selectedScore.breakdown.skills.score}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${selectedScore.breakdown.skills.score}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{selectedScore.breakdown.skills.explanation}</p>
                      
                      {selectedScore.breakdown.skills.matchedSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {selectedScore.breakdown.skills.matchedSkills.map((skill, i) => (
                            <Badge key={i} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              ✓ {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {selectedScore.breakdown.skills.synonymMatches.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          <span className="font-medium">Synonym matches:</span>{' '}
                          {selectedScore.breakdown.skills.synonymMatches.map(m => 
                            `${m.matched} → ${m.required}`
                          ).join(', ')}
                        </div>
                      )}
                    </div>

                    {/* Experience */}
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">Experience ({selectedScore.breakdown.experience.weight}%)</h4>
                        <span className="text-lg font-bold">{selectedScore.breakdown.experience.score}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${selectedScore.breakdown.experience.score}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600">{selectedScore.breakdown.experience.explanation}</p>
                      <div className="text-xs text-gray-500 mt-1">
                        {selectedScore.breakdown.experience.totalYears} years total 
                        (required: {selectedScore.breakdown.experience.requiredYears})
                      </div>
                    </div>

                    {/* Education */}
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">Education ({selectedScore.breakdown.education.weight}%)</h4>
                        <span className="text-lg font-bold">{selectedScore.breakdown.education.score}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${selectedScore.breakdown.education.score}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600">{selectedScore.breakdown.education.explanation}</p>
                      <div className="text-xs text-gray-500 mt-1">
                        Highest: {selectedScore.breakdown.education.highestDegree} 
                        ({selectedScore.breakdown.education.normalizedLevel})
                      </div>
                    </div>

                    {/* Other Factors */}
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">Other Factors ({selectedScore.breakdown.other.weight}%)</h4>
                        <span className="text-lg font-bold">{selectedScore.breakdown.other.score}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div
                          className="bg-orange-600 h-2 rounded-full"
                          style={{ width: `${selectedScore.breakdown.other.score}%` }}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedScore.breakdown.other.factors.map((factor, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className={factor.present ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}
                          >
                            {factor.present ? '✓' : '✗'} {factor.factor} (+{factor.points})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {selectedScore.recommendations.length > 0 && (
                    <div className="border rounded-lg p-4 bg-blue-50">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-blue-600" />
                        Recommendations
                      </h4>
                      <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                        {selectedScore.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            {/* Red Flags Tab */}
            <TabsContent value="redflags" className="space-y-4">
              {selectedScore?.redFlags.length === 0 ? (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">No Red Flags</AlertTitle>
                  <AlertDescription className="text-green-700">
                    No issues detected for this candidate.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {selectedScore?.redFlags.map((flag, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-lg border ${
                        flag.severity === 'high' ? 'border-red-200 bg-red-50' :
                        flag.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                        'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getSeverityColor(flag.severity)}>
                              {flag.severity.toUpperCase()}
                            </Badge>
                            <span className="font-medium">{flag.type.replace(/_/g, ' ')}</span>
                          </div>
                          <p className="text-sm text-gray-700">{flag.description}</p>
                          {flag.evidence && (
                            <p className="text-xs text-gray-500 mt-1">{flag.evidence}</p>
                          )}
                        </div>
                        <AlertCircle className={`h-5 w-5 ${
                          flag.severity === 'high' ? 'text-red-500' :
                          flag.severity === 'medium' ? 'text-yellow-500' :
                          'text-gray-400'
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Override Tab */}
            <TabsContent value="override" className="space-y-4">
              {selectedScore && (
                <>
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertTitle>Score Override</AlertTitle>
                    <AlertDescription>
                      Override the automated score with a manual value. All changes are logged for audit purposes.
                    </AlertDescription>
                  </Alert>

                  <div className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Current Score: {selectedScore.resumeScore}</span>
                      <span className="text-sm font-medium">New Score: {overrideValue}</span>
                    </div>

                    <Slider
                      value={[overrideValue]}
                      onValueChange={(value) => setOverrideValue(value[0])}
                      min={0}
                      max={100}
                      step={1}
                      className="w-full"
                    />

                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0 - Not Qualified</span>
                      <span>60 - Qualified</span>
                      <span>75 - Strong</span>
                      <span>90 - Exceptional</span>
                    </div>

                    {overrideValue !== selectedScore.resumeScore && (
                      <div className="flex items-center gap-2 text-sm">
                        {overrideValue > selectedScore.resumeScore ? (
                          <>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className="text-green-600">
                              +{overrideValue - selectedScore.resumeScore} points
                            </span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="h-4 w-4 text-red-600" />
                            <span className="text-red-600">
                              {overrideValue - selectedScore.resumeScore} points
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Reason for Override <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        value={overrideReason}
                        onChange={(e) => setOverrideReason(e.target.value)}
                        placeholder="Explain why this score is being overridden (min 10 characters)..."
                        rows={3}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {overrideReason.length}/10 characters (minimum)
                      </p>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setOverrideValue(selectedScore.resumeScore);
                          setOverrideReason('');
                        }}
                      >
                        Reset
                      </Button>
                      <Button
                        onClick={handleOverrideSubmit}
                        disabled={saving || overrideValue === selectedScore.resumeScore || overrideReason.length < 10}
                      >
                        {saving ? 'Saving...' : 'Submit Override'}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Audit History Tab */}
            <TabsContent value="audit" className="space-y-4">
              {auditHistory.length === 0 ? (
                <Alert>
                  <History className="h-4 w-4" />
                  <AlertTitle>No Audit History</AlertTitle>
                  <AlertDescription>
                    No score changes have been recorded for this candidate.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {auditHistory.map((entry) => (
                    <div key={entry.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {entry.actorType === 'system' ? (
                            <Zap className="h-4 w-4 text-blue-500" />
                          ) : (
                            <User className="h-4 w-4 text-purple-500" />
                          )}
                          <span className="font-medium">{entry.actorName || 'System'}</span>
                          <Badge variant="outline" className="text-xs">
                            {entry.action.replace(/-/g, ' ')}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(entry.createdAt).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        {entry.previousScore !== null ? (
                          <>
                            <span className="text-gray-500">
                              {entry.previousScore} → {entry.newScore}
                            </span>
                            {entry.newScore > entry.previousScore ? (
                              <span className="text-green-600 flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                +{entry.newScore - entry.previousScore}
                              </span>
                            ) : (
                              <span className="text-red-600 flex items-center gap-1">
                                <TrendingDown className="h-3 w-3" />
                                {entry.newScore - entry.previousScore}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-500">Initial score: {entry.newScore}</span>
                        )}
                      </div>

                      {entry.reason && (
                        <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {entry.reason}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}

export default CandidateScoreOverride;
