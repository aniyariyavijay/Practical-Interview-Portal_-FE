import { Routes } from '@angular/router';

export const submissionRoutes: Routes = [
  {
    path: 'file-submission',
    loadComponent: () =>
      import('./components/file-submission').then(m => m.FileSubmission)
  }
];