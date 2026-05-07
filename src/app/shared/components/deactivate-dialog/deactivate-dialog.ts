import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './deactivate-dialog.html'
})
export class DeactivateDialogComponent implements OnInit {

  reasons = [
    { label: 'Incorrect Entry', value: 'incorrect' },
    { label: 'Resigned', value: 'resigned' },
    { label: 'Terminated', value: 'terminated' },
    { label: 'Other', value: 'other' }
  ];

  form;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DeactivateDialogComponent>
  ) {
    this.form = this.fb.group({
      reason: ['', Validators.required],
      customReason: ['']
    });
  }

  ngOnInit() {
    this.form.get('reason')?.valueChanges.subscribe(value => {

      const custom = this.form.get('customReason');

      // ✅ FIXED HERE (use 'other')
      if (value === 'other') {
        custom?.setValidators([Validators.required]);
      } else {
        custom?.clearValidators();
        custom?.setValue('');
      }

      custom?.updateValueAndValidity();
    });
  }

  submit() {
    if (this.form.invalid) return;

    const { reason, customReason } = this.form.value;

    // ✅ FIXED HERE (use 'other')
    const finalReason =
      reason === 'other' ? customReason : reason;

    this.dialogRef.close(finalReason);
  }

  close() {
    this.dialogRef.close(null);
  }
}