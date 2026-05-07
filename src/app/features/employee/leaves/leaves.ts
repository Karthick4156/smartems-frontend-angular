import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LeaveService } from '../../../core/services/leave.service';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './leaves.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeavesComponent implements OnInit {

  form: FormGroup;
  leaves: any[] = [];
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private service: LeaveService
  ) {
    this.form = this.fb.group({
      leaveType: ['Paid', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      reason: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadLeaves();
  }

  // ✅ LOAD LEAVES
  loadLeaves() {
    this.service.getMyLeaves().subscribe({
      next: (res: any) => {
        this.leaves = res?.data?.items || [];
      },
      error: (err: any) => {
        console.error('Failed to load leaves:', err);
        this.errorMessage = 'Failed to load leaves';
        this.leaves = [];
      }
    });
  }

  // ✅ SUBMIT
  submit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;

    const payload = {
      leaveType: raw.leaveType,
      fromDate: new Date(raw.fromDate).toISOString(),
      toDate: new Date(raw.toDate).toISOString(),
      reason: raw.reason
    };

    this.service.applyLeave(payload).subscribe({
      next: () => {
        this.loadLeaves();

        this.form.reset({
          leaveType: 'Paid'
        });
      },
      error: (err) => {
        // ✅ CAPTURE BACKEND MESSAGE
        this.errorMessage =
          err.error?.message || err.error || 'Something went wrong';
      }
    });
  }
}