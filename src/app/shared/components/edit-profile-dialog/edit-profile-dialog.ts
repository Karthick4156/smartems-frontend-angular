import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
    <h2 mat-dialog-title>Edit Profile</h2>

    <form [formGroup]="form" (ngSubmit)="submit()">

      <mat-dialog-content class="space-y-3">

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Phone</mat-label>
          <input matInput formControlName="phone">
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Address</mat-label>
          <input matInput formControlName="address">
        </mat-form-field>

      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="close()">Cancel</button>
        <button mat-raised-button color="primary" type="submit">Save</button>
      </mat-dialog-actions>

    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditProfileDialogComponent {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      phone: [data?.phone || ''],
      address: [data?.address || '']
    });
  }

  submit() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }
}