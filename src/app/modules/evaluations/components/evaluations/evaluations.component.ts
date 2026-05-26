import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  AssessmentListItem,
  QuestionItem,
  SubmissionState,
} from '../../interfaces/evaluation.mode';

@Component({
  selector: 'app-file-submission',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './evaluations.component.html',
  styleUrl: './evaluations.component.scss',
})
export class EvaluationsComponent implements OnInit {
  private readonly http = inject(HttpClient);

  assessments: AssessmentListItem[] = [];

  selectedAssessmentId: number | null = null;

  candidateName = '';

  qs: QuestionItem[] = [];

  submissionState = signal<SubmissionState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: null,
    result: null,
  });

  draggingSolution = signal<Record<number, boolean>>({});
  draggingSubmission = signal<Record<number, boolean>>({});

  ngOnInit(): void {
    this.loadAssessments();
  }

  loadAssessments() {
    // API CALL

    // this.http
    //   .get<AssessmentListItem[]>(
    //     'http://localhost:8080/api/assessments/submission-list'
    //   )
    //   .subscribe({
    //     next: (res) => {
    //       this.assessments = res;
    //     },
    //   });

    // DUMMY DATA

    this.assessments = [
      {
        id: 1,
        title: 'Java Backend Round',
        candidateName: 'Rahul Sharma',
      },

      {
        id: 2,
        title: 'Spring Boot Assessment',
        candidateName: 'Anjali Patel',
      },

      {
        id: 3,
        title: 'DSA Technical Round',
        candidateName: 'Vivek Mehta',
      },
    ];
  }

  onAssessmentChange(id: number) {
    this.selectedAssessmentId = id;

    // API CALL

    // this.http
    //   .get<any>(
    //     `http://localhost:8080/api/assessments/${id}/submission-data`
    //   )
    //   .subscribe({
    //     next: (res) => {
    //
    //       this.candidateName = res.candidate.name;
    //
    //       this.qs = res.questions.map((q: any) => ({
    //         questionId: q.id,
    //         title: q.title,
    //         solutionFile: null,
    //         submissionFile: null,
    //       }));
    //     },
    //   });

    // DUMMY DATA

    if (id === 1) {
      this.candidateName = 'Rahul Sharma';

      this.qs = [
        {
          questionId: 1,
          questionTopic: 'Implement Singleton Design Pattern in Java',
          solutionFile: null,
          submissionFile: null,
        },

        {
          questionId: 2,
          questionTopic: 'Find Duplicate Elements using Java Streams',
          solutionFile: null,
          submissionFile: null,
        },

        {
          questionId: 3,
          questionTopic: 'Create REST API using Spring Boot',
          solutionFile: null,
          submissionFile: null,
        },
      ];
    } else if (id === 2) {
      this.candidateName = 'Anjali Patel';

      this.qs = [
        {
          questionId: 4,
          questionTopic: 'Implement JWT Authentication in Spring Boot',
          solutionFile: null,
          submissionFile: null,
        },

        {
          questionId: 5,
          questionTopic: 'Create Global Exception Handler',
          solutionFile: null,
          submissionFile: null,
        },

        {
          questionId: 6,
          questionTopic: 'Implement Pagination and Sorting API',
          solutionFile: null,
          submissionFile: null,
        },
      ];
    } else if (id === 3) {
      this.candidateName = 'Vivek Mehta';

      this.qs = [
        {
          questionId: 7,
          questionTopic: 'Binary Search using Java',
          solutionFile: null,
          submissionFile: null,
        },

        {
          questionId: 8,
          questionTopic: 'Reverse Linked List',
          solutionFile: null,
          submissionFile: null,
        },

        {
          questionId: 9,
          questionTopic: 'Find Longest Substring Without Repeating Characters',
          solutionFile: null,
          submissionFile: null,
        },
      ];
    }
  }

  canSubmit(): boolean {
    return (
      this.selectedAssessmentId !== null &&
      this.qs.length > 0 &&
      this.qs.every((q) => q.solutionFile !== null && q.submissionFile !== null)
    );
  }

  completedCount(): number {
    return this.qs.filter((q) => q.solutionFile && q.submissionFile).length;
  }

  onFileSelected(
    event: Event,
    index: number,
    type: 'solution' | 'submission',
  ): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    const file = input.files[0];

    if (!file.name.endsWith('.java')) {
      this.submissionState.update((s) => ({
        ...s,
        isError: true,
        errorMessage: 'Only .java files are allowed',
      }));

      return;
    }

    if (type === 'solution') {
      this.qs[index].solutionFile = file;
    } else {
      this.qs[index].submissionFile = file;
    }

    this.submissionState.update((s) => ({
      ...s,
      isError: false,
      errorMessage: null,
    }));
  }

  clearFile(index: number, type: 'solution' | 'submission') {
    if (type === 'solution') {
      this.qs[index].solutionFile = null;
    } else {
      this.qs[index].submissionFile = null;
    }
  }

  onDragOver(
    event: DragEvent,
    index: number,
    type: 'solution' | 'submission',
  ): void {
    event.preventDefault();

    this.setDrag(index, type, true);
  }

  onDragLeave(index: number, type: 'solution' | 'submission'): void {
    this.setDrag(index, type, false);
  }

  onDrop(
    event: DragEvent,
    index: number,
    type: 'solution' | 'submission',
  ): void {
    event.preventDefault();

    this.setDrag(index, type, false);

    const file = event.dataTransfer?.files[0];

    if (!file) return;

    if (!file.name.endsWith('.java')) return;

    if (type === 'solution') {
      this.qs[index].solutionFile = file;
    } else {
      this.qs[index].submissionFile = file;
    }
  }

  private setDrag(
    index: number,
    type: 'solution' | 'submission',
    val: boolean,
  ): void {
    if (type === 'solution') {
      this.draggingSolution.update((d) => ({
        ...d,
        [index]: val,
      }));
    } else {
      this.draggingSubmission.update((d) => ({
        ...d,
        [index]: val,
      }));
    }
  }

  onSubmit(): void {
    if (!this.selectedAssessmentId) return;

    this.submissionState.update((s) => ({
      ...s,
      isLoading: true,
    }));

    const formData = new FormData();

    formData.append('totalQuestions', this.qs.length.toString());
    formData.append('assessmentId', this.selectedAssessmentId.toString());

    this.qs.forEach((q, index) => {
      formData.append(`question_${index}`, q.questionId.toString());

      if (q.solutionFile) {
        formData.append(`solution_${index}`, q.solutionFile);
      }

      if (q.submissionFile) {
        formData.append(`submission_${index}`, q.submissionFile);
      }
    });

    this.http
      .post('http://localhost:8080/api/mock-interview/evaluate-multi', formData)
      .subscribe({
        next: (res: any) => {
          this.submissionState.update((s) => ({
            ...s,
            isLoading: false,
            isSuccess: true,
            result: res,
          }));
        },

        error: () => {
          this.submissionState.update((s) => ({
            ...s,
            isLoading: false,
            isError: true,
            errorMessage: 'Evaluation failed',
          }));
        },
      });
  }

  reset(): void {
    this.selectedAssessmentId = null;

    this.candidateName = '';

    this.qs = [];

    this.submissionState.set({
      isLoading: false,
      isSuccess: false,
      isError: false,
      errorMessage: null,
      result: null,
    });
  }

  isDraggingSol(i: number): boolean {
    return this.draggingSolution()[i] ?? false;
  }

  isDraggingSub(i: number): boolean {
    return this.draggingSubmission()[i] ?? false;
  }

  scoreColor(score: number): string {
    if (score >= 75) return '#16a34a';

    if (score >= 50) return '#d97706';

    return '#dc2626';
  }

  scoreLabel(score: number): string {
    if (score >= 75) return 'Strong';

    if (score >= 50) return 'Average';

    return 'Weak';
  }

  formatSize(bytes: number): string {
    return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
  }
}
