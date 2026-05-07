import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  FormGroup
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: 'reset-password-dialog.html'
})
export class ResetPasswordDialogComponent {

  form!: FormGroup;

  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ResetPasswordDialogComponent>
  ) {
    // ✅ SAFE INITIALIZATION (NO ERROR)
    this.form = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/)
          ]
        ],
        confirmPassword: ['', Validators.required]
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }

  // ✅ MATCH VALIDATOR
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password === confirmPassword
      ? null
      : { passwordMismatch: true };
  }

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPassword() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.form.value.password);
  }

  close() {
    this.dialogRef.close(null);
  }
}