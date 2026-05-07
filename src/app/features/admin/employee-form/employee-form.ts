import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MasterService } from '../../../core/services/master.service';
import { Subject, takeUntil } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

interface EmployeeFormData {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  departmentId: number;
  designationId: number;
  joiningDate: Date;
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinner,
  ],
  templateUrl: './employee-form.html'
})
export class EmployeeFormComponent implements OnInit, OnDestroy {

  departments: any[] = [];
  designations: any[] = [];
  isLoading = false;
  maxDate = new Date(); // today
  isEditMode = false;

  isSaving = false;

  hidePassword = true;
  hideConfirmPassword = true;



  private destroy$ = new Subject<void>();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmployeeFormComponent>,
    private masterService: MasterService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: EmployeeFormData | null
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: [''],
      confirmPassword: [''],
      address: [''],
      departmentId: [null, Validators.required],
      designationId: [null, Validators.required],
      joiningDate: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.loadDepartments();

    // ✅ EDIT MODE
    if (this.data) {
      this.isEditMode = true;

      this.form.patchValue({
        name: this.data.name,
        email: this.data.email,
        phone: this.data.phone,
        address: this.data.address,
        departmentId: this.data.departmentId,
        designationId: this.data.designationId,
        joiningDate: this.data.joiningDate
          ? new Date(this.data.joiningDate).toISOString()
          : null
      });

      // ✅ Load designations for selected department
      if (this.data.departmentId) {
        this.loadDesignations(this.data.departmentId);
      }

      // ✅ Disable fields (edit restrictions)
      this.form.get('email')?.disable();
      this.form.get('joiningDate')?.disable();
    }

    if (!this.isEditMode) {
      this.form.get('password')?.setValidators([Validators.required]);
      this.form.get('confirmPassword')?.setValidators([Validators.required]);
    }

    // ✅ Department change logic
    this.form.get('departmentId')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((deptId: number) => {

        // Reset dependent field
        this.form.patchValue({ designationId: null });
        this.designations = [];

        if (deptId) {
          this.loadDesignations(deptId);
        }
      });
  }

  loadDepartments() {
    this.masterService.getDepartments()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {

        this.departments = res?.data || [];

        this.cdr.detectChanges(); // ✅ FIX NG0100
      });
  }

  loadDesignations(deptId: number) {
    this.masterService.getDesignations(deptId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {

        this.designations = res?.data || [];

        this.cdr.detectChanges(); // ✅ ALSO HERE
      });
  }

  submit() {
    if (this.form.invalid) return;

    this.isSaving = true;

    const raw = this.form.getRawValue();

    // ✅ Password check only in create
    if (!this.isEditMode) {
      if (raw.password !== raw.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
    }

    const payload: any = {
      name: raw.name,
      email: raw.email,
      phone: raw.phone,
      address: raw.address,
      departmentId: Number(raw.departmentId),
      designationId: Number(raw.designationId),
      joiningDate: raw.joiningDate
        ? new Date(raw.joiningDate).toISOString().split('T')[0]
        : null
    };

    // ✅ Only include password for create
    if (!this.isEditMode) {
      payload.password = raw.password;
      payload.confirmPassword = raw.confirmPassword;
    }

    setTimeout(() => {
      this.dialogRef.close(payload);
      this.isSaving = false;
    }, 300); // small UX delay

  }

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPassword() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  close() {
    this.dialogRef.close(null);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}