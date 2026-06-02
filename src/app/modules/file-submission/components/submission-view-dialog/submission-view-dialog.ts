import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-submission-view-dialog',
  standalone: true,
  templateUrl: './submission-view-dialog.html',
  styleUrl: './submission-view-dialog.scss',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
  ],
})
export class SubmissionViewDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
  ) { }
}