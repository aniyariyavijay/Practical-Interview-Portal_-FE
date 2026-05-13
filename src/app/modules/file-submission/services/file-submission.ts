import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EvaluationResult, FileSubmissionRequest, MultiQuestionEvaluationResult } from '../interfaces/file-submission.model';

@Injectable({
  providedIn: 'root',
})
export class FileSubmissionService {
  private readonly http = inject(HttpClient);
  private readonly base = 'http://localhost:8080/api/mock-interview';

  /** Single question */
  submitSingle(
    solutionFile: File,
    submissionFile: File,
    questionTopic: string
  ): Observable<EvaluationResult> {
    const fd = new FormData();
    fd.append('solution',   solutionFile,   solutionFile.name);
    fd.append('submission', submissionFile, submissionFile.name);
    fd.append('question',   questionTopic);
    return this.http
      .post<EvaluationResult>(`${this.base}/evaluate-files`, fd)
      .pipe(catchError(this.handleError));
  }

  /** Multiple questions (1–4) */
  submitMultiple(
    questions: FileSubmissionRequest[]
  ): Observable<MultiQuestionEvaluationResult> {
    const fd = new FormData();
    fd.append('totalQuestions', questions.length.toString());

    questions.forEach((q, i) => {
      fd.append(`solution_${i}`,   q.solutionFile!,   q.solutionFile!.name);
      fd.append(`submission_${i}`, q.submissionFile!, q.submissionFile!.name);
      fd.append(`question_${i}`,   q.questionTopic);
    });

    return this.http
      .post<MultiQuestionEvaluationResult>(`${this.base}/evaluate-multi`, fd)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let msg = 'Unexpected error occurred.';
    if (error.status === 0)   msg = 'Cannot reach server. Is Spring running?';
    if (error.status === 400) msg = error.error?.message ?? 'Bad request.';
    if (error.status === 500) msg = 'Server error. Check Spring logs.';
    return throwError(() => new Error(msg));
  }
}
