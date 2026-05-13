export interface FileSubmissionRequest {
    solutionFile: File | null;
    submissionFile: File | null;
    questionTopic: string;
  }
  
  export interface EvaluationResult {
    score: number;
    feedback: string;
    timeComplexity: string;
    spaceComplexity: string;
    missedEdgeCases: string[];
    securityIssues: string[];
    optimizedCode: string;
  }
  
  export interface QuestionEvaluationResult {
    questionNumber: number;
    questionTopic: string;
    evaluation: EvaluationResult;
  }
  
  export interface MultiQuestionEvaluationResult {
    overallScore: number;
    totalQuestions: number;
    results: QuestionEvaluationResult[];
  }
  
  export interface SubmissionState {
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    errorMessage: string | null;
    result: MultiQuestionEvaluationResult | null;
  }