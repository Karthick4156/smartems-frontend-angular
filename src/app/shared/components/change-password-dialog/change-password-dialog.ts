import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
    <h2 mat-dialog-title>Change Password</h2>

    <form [formGroup]="form" (ngSubmit)="submit()">

      <mat-dialog-content class="space-y-3">

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Current Password</mat-label>
          <input matInput type="password" formControlName="currentPassword">
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>New Password</mat-label>
          <input matInput type="password" formControlName="newPassword">
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Confirm Password</mat-label>
          <input matInput type="password" formControlName="confirmPassword">
        </mat-form-field>

      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="close()">Cancel</button>
        <button mat-raised-button color="primary" type="submit">Change</button>
      </mat-dialog-actions>

    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordDialogComponent {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>
  ) {
    this.form = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  submit() {
    const { currentPassword, newPassword, confirmPassword } = this.form.value;

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    this.dialogRef.close({
      currentPassword,
      newPassword,
      confirmPassword
    });
  }

  close() {
    this.dialogRef.close();
  }
}