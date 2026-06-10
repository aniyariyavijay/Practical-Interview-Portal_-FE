import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Question {
  id: string;
  title: string;
  type: string;
  difficulty: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  initials?: string;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'completed';
  questionIds: string[];
  candidateIds: string[];
  createdAt: string;
}

export interface Draft {
  title: string;
  description: string;
  questionIds: string[];
  candidateIds: string[];
}

export interface Toast {
  msg: string;
  type: 'success' | 'error';
}

@Component({
  selector: 'app-assessments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.scss'],
})
export class AssessmentsComponent implements OnInit {
  private _uid = 100;

  staticQuestions: Question[] = [
    {
      id: 'q1',
      title: 'Reverse a linked list',
      type: 'coding',
      difficulty: 'medium',
    },
    {
      id: 'q2',
      title: 'Explain REST vs GraphQL',
      type: 'theory',
      difficulty: 'easy',
    },
    {
      id: 'q3',
      title: 'Design a rate limiter',
      type: 'system-design',
      difficulty: 'hard',
    },
    {
      id: 'q4',
      title: 'Find duplicate in array',
      type: 'coding',
      difficulty: 'easy',
    },
    {
      id: 'q5',
      title: 'Binary search tree traversal',
      type: 'coding',
      difficulty: 'medium',
    },
  ];

  staticCandidates: Candidate[] = [
    { id: 'c1', name: 'Aisha Mehta', email: 'aisha.mehta@example.com' },
    { id: 'c2', name: 'Carlos Romero', email: 'carlos.r@example.com' },
    { id: 'c3', name: 'Priya Nair', email: 'priya.nair@example.com' },
    { id: 'c4', name: 'Jordan Lee', email: 'jordan.lee@example.com' },
  ];

  assessments: Assessment[] = [
    {
      id: 'a1',
      title: 'Frontend Engineer — Round 1',
      description: 'Covers React fundamentals and system design basics.',
      status: 'published',
      questionIds: ['q1', 'q2'],
      candidateIds: ['c1', 'c2'],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'a2',
      title: 'Backend Screening',
      description: '',
      status: 'draft',
      questionIds: ['q3'],
      candidateIds: [],
      createdAt: new Date().toISOString(),
    },
  ];

  open = false;
  step = 1;
  draft: Draft = {
    title: '',
    description: '',
    questionIds: [],
    candidateIds: [],
  };
  toast: Toast | null = null;
  private toastTimer: any;

  ngOnInit(): void {
    // Precompute candidate initials
    this.staticCandidates = this.staticCandidates.map((c) => ({
      ...c,
      initials: c.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase(),
    }));
  }

  private uid(): string {
    return `id_${++this._uid}`;
  }

  showToast(msg: string, type: 'success' | 'error' = 'success'): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toast = { msg, type };
    this.toastTimer = setTimeout(() => (this.toast = null), 2500);
  }

  reset(): void {
    this.draft = {
      title: '',
      description: '',
      questionIds: [],
      candidateIds: [],
    };
    this.step = 1;
  }

  openModal(): void {
    this.open = true;
  }

  closeModal(): void {
    this.open = false;
    this.reset();
  }

  create(): void {
    if (!this.draft.title.trim()) {
      this.showToast('Title is required', 'error');
      return;
    }
    const newAssessment: Assessment = {
      id: this.uid(),
      status: 'draft',
      createdAt: new Date().toISOString(),
      title: this.draft.title,
      description: this.draft.description,
      questionIds: [...this.draft.questionIds],
      candidateIds: [...this.draft.candidateIds],
    };
    this.assessments = [newAssessment, ...this.assessments];
    this.showToast('Assessment created');
    this.closeModal();
  }

  setStatus(id: string, status: 'draft' | 'published' | 'completed'): void {
    this.assessments = this.assessments.map((a) =>
      a.id === id ? { ...a, status } : a,
    );
    this.showToast(`Marked ${status}`);
  }

  remove(id: string): void {
    this.assessments = this.assessments.filter((a) => a.id !== id);
    this.showToast('Deleted');
  }

  toggleQuestion(id: string): void {
    this.draft.questionIds = this.draft.questionIds.includes(id)
      ? this.draft.questionIds.filter((x) => x !== id)
      : [...this.draft.questionIds, id];
  }

  toggleCandidate(id: string): void {
    this.draft.candidateIds = this.draft.candidateIds.includes(id)
      ? this.draft.candidateIds.filter((x) => x !== id)
      : [...this.draft.candidateIds, id];
  }

  isQuestionSelected(id: string): boolean {
    return this.draft.questionIds.includes(id);
  }

  isCandidateSelected(id: string): boolean {
    return this.draft.candidateIds.includes(id);
  }

  getStatusClass(status: string): string {
    return `badge badge--${status}`;
  }

  prevStep(): void {
    if (this.step > 1) this.step--;
  }

  nextStep(): void {
    if (this.step < 3) this.step++;
  }

  trackById(_: number, item: { id: string }): string {
    return item.id;
  }
}
