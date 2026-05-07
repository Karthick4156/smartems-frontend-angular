import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AttendanceService } from '../../../core/services/attendance.service';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './corrections.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CorrectionsComponent implements OnInit {

  form: FormGroup;
  message = '';
  errorMessage = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private service: AttendanceService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      date: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit() { }

  submit() {
    setTimeout(() => {
      this.message = '';
      this.errorMessage = '';
    }, 3000);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;

    const reason = raw.reason?.trim();
    if (!reason) {
      this.errorMessage = 'Reason is required';
      return;
    }

    // 🔥 Date validation (block today & future)
    const selectedDate = new Date(raw.date);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate >= today) {
      this.errorMessage = 'Correction allowed only for past dates';
      return;
    }

    this.isSubmitting = true;
    this.cdr.markForCheck();

    const payload = {
      date: selectedDate.toLocaleDateString('en-CA'),
      reason
    };

    this.service.requestCorrection(payload).subscribe({
      next: (res: any) => {

        this.isSubmitting = false;

        // 🔥 Handle backend success flag
        if (!res.success) {
          this.errorMessage = res.message;
          this.cdr.markForCheck();
          return;
        }

        this.message = res.message || 'Request submitted successfully ✅';
        this.form.reset();

        this.autoClear();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isSubmitting = false;

        this.errorMessage =
          err.error?.errors?.reason?.[0] ||
          err.error?.message ||
          err.message ||
          'Failed to submit request';

        this.autoClear();
        this.cdr.markForCheck();
      }
    });
  }

  autoClear() {
    setTimeout(() => {
      this.message = '';
      this.errorMessage = '';
      this.cdr.markForCheck();
    }, 3000);
  }
}