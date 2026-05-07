import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { EmployeeService } from '../../../core/services/employee.service';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeFormComponent } from '../employee-form/employee-form';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { ResetPasswordDialogComponent } from '../../../shared/components/reset-password-dialog/reset-password-dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GridApi } from 'ag-grid-community';
import { DeactivateDialogComponent } from '../../../shared/components/deactivate-dialog/deactivate-dialog';
import { NotificationService } from '../../../core/services/notification.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Employee } from '../../../core/models/employee.model';
import { ApiResponse } from '../../../core/models/api-response.model';
import { ColDef } from 'ag-grid-community';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  selector: 'app-employees',
  imports: [
    CommonModule,
    AgGridModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './employees.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeesComponent implements OnInit, OnDestroy {

  rowData: Employee[] = [];
  isLoading = false;
  isSaving = false;

  private gridApi!: GridApi;
  private destroy$ = new Subject<void>();

  constructor(
    private service: EmployeeService,
    private dialog: MatDialog,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
  ) { }

  // ✅ GLOBAL GRID CONFIG
  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 120
  };

  columnDefs: ColDef<Employee>[] = [

    {
      field: 'employeeCode',
      headerName: 'Employee Code',
      headerClass: 'text-center',
      cellClass: 'text-center font-semibold'
    },

    {
      field: 'name',
      headerName: 'Name',
      headerClass: 'text-center',
      cellClass: 'text-center font-semibold text-gray-800'
    },

    {
      field: 'email',
      headerName: 'Email',
      headerClass: 'text-center',
      cellClass: 'text-center text-gray-600'
    },

    {
      field: 'phone',
      headerName: 'Phone',
      headerClass: 'text-center',
      cellClass: 'text-center'
    },

    {
      field: 'department',
      headerName: 'Department',
      headerClass: 'text-center',
      cellClass: 'text-center'
    },

    {
      field: 'designation',
      headerName: 'Designation',
      headerClass: 'text-center',
      cellClass: 'text-center'
    },

    {
      field: 'status',
      headerName: 'Status',
      headerClass: 'text-center',
      cellClass: 'text-center',
      cellRenderer: (params: any) => {

        const isActive = params.value === 'Active' || params.value === 1;

        const span = document.createElement('span');
        span.innerText = isActive ? 'Active' : 'Inactive';

        span.className = `
          px-3 py-1 text-xs font-semibold rounded-full
          ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}
        `;

        return span;
      }
    },

    {
      field: 'inactiveReason',
      headerName: 'Reason',
      headerClass: 'text-center',
      cellClass: 'text-center text-gray-500'
    },

    {
      headerName: 'Actions',
      sortable: false,
      filter: false,
      cellStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      },

      cellRenderer: (params: any) => {

        const container = document.createElement('div');
        container.className = 'flex gap-2';

        const createBtn = (icon: string, color: string, clickFn: () => void) => {
          const btn = document.createElement('button');
          btn.innerHTML = `<span class="material-icons text-base ${color}">${icon}</span>`;
          btn.className = 'p-1 hover:bg-gray-100 rounded';
          btn.onclick = () => {
            if (this.isSaving) return;
            clickFn();
          };
          return btn;
        };

        container.appendChild(
          createBtn('edit', 'text-blue-600', () =>
            this.openEditDialog(params.data)
          )
        );

        container.appendChild(
          createBtn(
            params.data.status === 'Active' ? 'block' : 'check_circle',
            params.data.status === 'Active' ? 'text-red-500' : 'text-green-600',
            () => this.toggleStatus(params.data)
          )
        );

        container.appendChild(
          createBtn('lock_reset', 'text-yellow-600', () =>
            this.openResetDialog(params.data)
          )
        );

        return container;
      }
    }
  ];

  ngOnInit(): void {
    this.loadData();
  }

  // GRID READY
  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  // SEARCH
  onSearch(event: any) {
    const value = event.target.value;

    if (this.gridApi) {
      this.gridApi.setGridOption('quickFilterText', value);
    }
  }
  // LOAD DATA
  loadData() {
    this.isLoading = true;

    this.service.getEmployees()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ApiResponse<Employee[]>) => {
          this.rowData = (res.data as any)?.items || res.data;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }

  // ADD
  openAddDialog() {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '500px',
      maxHeight: '90vh',
      autoFocus: false
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.isSaving = true;
          this.service.createEmployee(result)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.notification.success('Employee created successfully');
                this.loadData();
                this.isSaving = false;
                this.cdr.markForCheck();
              },
              error: () => {
                this.isSaving = false;
                this.cdr.markForCheck();
              }
            });
        }
      });
  }

  // EDIT
  openEditDialog(data: any) {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '500px',
      maxHeight: '90vh',
      autoFocus: false,
      data
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.isSaving = true;
          this.service.updateEmployee(data.id, result)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.notification.success('Employee updated successfully');
                this.loadData();
                this.isSaving = false;
                this.cdr.markForCheck();
              },
              error: () => {
                this.isSaving = false;
                this.cdr.markForCheck();
              }
            });
        }
      });
  }

  // STATUS TOGGLE
  toggleStatus(data: any) {

    const isActive = data.status === 'Active' || data.status === 1;

    if (isActive) {

      const dialogRef = this.dialog.open(DeactivateDialogComponent, {
        width: '400px'
      });

      dialogRef.afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(reason => {
          if (reason) {
            this.service.updateStatus(data.id, false, reason)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: () => {
                  this.notification.success('Employee deactivated');
                  this.loadData();
                  this.cdr.markForCheck();
                }
              });
          }
        });

    } else {

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: {
          title: 'Activate Employee',
          message: 'Are you sure you want to activate this employee?',
          type: 'warning',
          confirmText: 'Activate'
        }
      });

      dialogRef.afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(result => {
          if (result) {
            this.service.updateStatus(data.id, true, '')
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: () => {
                  this.notification.success('Employee activated');
                  this.loadData();
                  this.cdr.markForCheck();
                }
              });
          }
        });
    }
  }

  // RESET PASSWORD
  openResetDialog(data: any) {

    const dialogRef = this.dialog.open(ResetPasswordDialogComponent);

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(password => {

        if (password) {

          this.isSaving = true;

          this.service.resetPassword(
            data.email,
            password,
            password   // or backend may ignore confirm
          )
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.notification.success('Password reset successfully');
                this.isSaving = false;
                this.cdr.markForCheck();
              },
              error: () => {
                this.isSaving = false;
                this.cdr.markForCheck();
              }
            });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}