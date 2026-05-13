import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileSubmissionRequest, MultiQuestionEvaluationResult, SubmissionState } from '../interfaces/file-submission.model';
import { FileSubmissionService } from '../services/file-submission';
@Component({
  selector: 'app-file-submission',
  imports: [CommonModule, FormsModule],
  templateUrl: './file-submission.html',
  styleUrl: './file-submission.scss',
})
export class FileSubmission {
  private readonly svc = inject(FileSubmissionService);

  readonly MAX_QUESTIONS = 4;

  questions = signal<FileSubmissionRequest[]>([
    { questionTopic: '', solutionFile: null, submissionFile: null }
  ]);

  submissionState = signal<SubmissionState>({
    isLoading: false, isSuccess: false,
    isError: false, errorMessage: null, result: null
  });

  draggingSolution = signal<Record<number, boolean>>({});
  draggingSubmission = signal<Record<number, boolean>>({});

  // ── Computed ──────────────────────────────────────────────────────
  canSubmit = computed(() =>
    !this.submissionState().isLoading &&
    this.questions().length > 0 &&
    this.questions().every(q =>
      q.questionTopic.trim().length > 0 &&
      q.solutionFile !== null &&
      q.submissionFile !== null
    )
  );

  completedCount = computed(() =>
    this.questions().filter(q =>
      q.questionTopic.trim() && q.solutionFile && q.submissionFile
    ).length
  );

  // ── Question Management ───────────────────────────────────────────
  addQuestion(): void {
    if (this.questions().length >= this.MAX_QUESTIONS) return;
    this.questions.update(qs => [
      ...qs,
      { questionTopic: '', solutionFile: null, submissionFile: null }
    ]);
  }

  removeQuestion(index: number): void {
    if (this.questions().length <= 1) return;
    this.questions.update(qs => qs.filter((_, i) => i !== index));
  }

  updateTopic(index: number, value: string): void {
    this.questions.update(qs => {
      const updated = [...qs];
      updated[index] = { ...updated[index], questionTopic: value };
      return updated;
    });
  }

  // ── File Handlers ─────────────────────────────────────────────────
  onFileSelected(event: Event, index: number, type: 'solution' | 'submission'): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) this.validateAndSet(input.files[0], index, type);
    input.value = ''; // reset so same file can be re-selected
  }

  onDragOver(event: DragEvent, index: number, type: 'solution' | 'submission'): void {
    event.preventDefault();
    this.setDrag(index, type, true);
  }

  onDragLeave(index: number, type: 'solution' | 'submission'): void {
    this.setDrag(index, type, false);
  }

  onDrop(event: DragEvent, index: number, type: 'solution' | 'submission'): void {
    event.preventDefault();
    this.setDrag(index, type, false);
    const file = event.dataTransfer?.files[0];
    if (file) this.validateAndSet(file, index, type);
  }

  clearFile(index: number, type: 'solution' | 'submission'): void {
    this.questions.update(qs => {
      const updated = [...qs];
      updated[index] = {
        ...updated[index],
        ...(type === 'solution'
          ? { solutionFile: null }
          : { submissionFile: null })
      };
      return updated;
    });
  }

  private validateAndSet(file: File, index: number, type: 'solution' | 'submission'): void {
    if (!file.name.endsWith('.java')) {
      this.submissionState.update(s => ({
        ...s, isError: true,
        errorMessage: `"${file.name}" is not a .java file. Only .java files are accepted.`
      }));
      return;
    }
    this.submissionState.update(s => ({ ...s, isError: false, errorMessage: null }));
    this.questions.update(qs => {
      const updated = [...qs];
      updated[index] = {
        ...updated[index],
        ...(type === 'solution' ? { solutionFile: file } : { submissionFile: file })
      };
      return updated;
    });
  }

  private setDrag(index: number, type: 'solution' | 'submission', val: boolean): void {
    if (type === 'solution') {
      this.draggingSolution.update(d => ({ ...d, [index]: val }));
    } else {
      this.draggingSubmission.update(d => ({ ...d, [index]: val }));
    }
  }

  // ── Submit ────────────────────────────────────────────────────────
  onSubmit(): void {
    if (!this.canSubmit()) return;

    this.submissionState.set({
      isLoading: true, isSuccess: false,
      isError: false, errorMessage: null, result: null
    });

    this.svc.submitMultiple(this.questions()).subscribe({
      next: (result: MultiQuestionEvaluationResult) => {
        this.submissionState.set({
          isLoading: false, isSuccess: true,
          isError: false, errorMessage: null, result
        });
      },
      error: (err: Error) => {
        this.submissionState.set({
          isLoading: false, isSuccess: false,
          isError: true, errorMessage: err.message, result: null
        });
      }
    });
  }

  reset(): void {
    this.questions.set([{ questionTopic: '', solutionFile: null, submissionFile: null }]);
    this.draggingSolution.set({});
    this.draggingSubmission.set({});
    this.submissionState.set({
      isLoading: false, isSuccess: false,
      isError: false, errorMessage: null, result: null
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────
  get qs(): FileSubmissionRequest[] { return this.questions(); }

  isDraggingSol(i: number): boolean { return this.draggingSolution()[i] ?? false; }
  isDraggingSub(i: number): boolean { return this.draggingSubmission()[i] ?? false; }

  scoreColor(score: number): string {
    if (score >= 75) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  }

  scoreLabel(score: number): string {
    if (score >= 75) return 'Strong';
    if (score >= 50) return 'Average';
    return 'Weak';
  }

  formatSize(bytes: number): string {
    return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
  }

  trackByIndex(index: number): number { return index; }
}
