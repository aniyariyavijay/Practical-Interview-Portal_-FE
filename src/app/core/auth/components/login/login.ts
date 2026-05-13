import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedMaterialModule } from '../../../../shared/material/share-material.module';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';
import { ApiResponse } from '../../../../shared/interfaces/api-response.interface';
import { LoginResponse } from '../../interfaces/login-response.interface';
import { SnackBarService } from '../../../../shared/services/snackbar.service';
@Component({
  selector: 'app-login',
  imports: [CommonModule,
    ReactiveFormsModule,
    SharedMaterialModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  // ✅ Signals (modern Angular)
  hidePassword = signal(true);
  isLoading = signal(false);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  // ✅ Form (best practice: FormBuilder)
  loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });


  constructor(
    private router: Router,
    private authService: AuthService,
    private snackbar: SnackBarService
  ) { }



  // 👁️ Toggle password
  togglePassword() {
    this.hidePassword.update(v => !v);
  }

  // 🚀 Submit login
  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const payload = this.loginForm.getRawValue();

    this.authService.login(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: ApiResponse<LoginResponse>) => {
          console.log(response);

          if (response.success && response.result) {
            this.isLoading.set(false);

            const accessToken = response.result.accessToken;
            const refreshToken = response.result.refreshToken;

            this.authService.setToken(accessToken, refreshToken);

            this.snackbar.Success('Login successful');
            this.router.navigate(['/']);
          }
          else {
            this.snackbar.Error(
              response.errorMessages?.join(",") ??
              "An error occurred during login."
            );
          }
        },
        error: (error) => {
          this.isLoading.set(false);
          this.snackbar.Error(error?.error?.message || 'Login failed');
        }
      });
  }

  // ✅ getters (clean HTML)
  get email() {
    return this.loginForm.controls.email;
  }

  get password() {
    return this.loginForm.controls.password;
  }
}
