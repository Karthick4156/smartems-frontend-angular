import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  errorMessage: string = '';
  isLoading: boolean = false;

  hidePassword = true;

  returnUrl: string = '/';

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/';
  }


  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const payload = this.loginForm.value as { email: string; password: string };

    console.log(payload);
    this.authService.login(payload).pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: (res: any) => {
        const token = res?.data?.token;
        if (!token) {
          this.errorMessage = 'Invalid response from server';
          return;
        }

        let decoded: any;
        try {
          decoded = jwtDecode(token);
        } catch (error) {
          this.errorMessage = 'Invalid token received';
          return;
        }

        // ✅ Map token → clean user object
        const user = {
          id: decoded?.userId,
          email: decoded?.sub,
          role: decoded?.role
        };

        if (!user.role) {
          this.errorMessage = 'Role missing in token';
          return;
        }

        // ✅ Store data
        this.authService.setToken(token);
        this.authService.setRole(user.role);
        this.authService.setUser(user);

        // ✅ Handle returnUrl
        if (this.returnUrl && this.returnUrl !== '/') {
          this.router.navigateByUrl(this.returnUrl);
          return;
        }

        // ✅ Role-based routing
        const routeMap: any = {
          Admin: '/admin/dashboard',
          Employee: '/employee/dashboard'
        };

        this.router.navigate([routeMap[user.role] || '/']);
      },

      error: (err) => {
        this.errorMessage =
          err?.error?.message || 'Invalid email or password';
      }
    });
  }
}