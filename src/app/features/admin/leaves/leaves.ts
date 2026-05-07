import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { LeaveService } from '../../../core/services/leave.service';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../../../core/services/notification.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    AgGridModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinner
  ],
  templateUrl: './leaves.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeavesComponent implements OnInit {

  rowData: any[] = [];
  isLoading = false;
  isProcessing = false;

  constructor(
    private service: LeaveService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
  ) { }

  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 120
  };

  columnDefs = [

    {
      field: 'employeeCode',
      headerName: 'Code',
      headerClass: 'text-center',
      cellClass: 'text-center font-semibold'
    },

    {
      field: 'name',
      headerName: 'Employee',
      cellClass: 'font-semibold text-center',
      
    },

    {
      field: 'leaveType',
      headerName: 'Type',
      cellClass: 'text-center'
    },

    {
      field: 'fromDate',
      headerName: 'From',
      headerClass: 'text-center',
      cellClass: 'text-center',
      valueFormatter: (params: any) =>
        params.value ? new Date(params.value).toLocaleDateString() : ''
    },

    {
      field: 'toDate',
      headerName: 'To',
      headerClass: 'text-center',
      cellClass: 'text-center',
      valueFormatter: (params: any) =>
        params.value ? new Date(params.value).toLocaleDateString() : ''
    },

    {
      field: 'status',
      headerName: 'Status',
      headerClass: 'text-center',
      cellRenderer: (params: any) => {

        const status = params.value;
        const span = document.createElement('span');

        let colorClass = '';

        switch (status) {
          case 'Approved':
            colorClass = 'bg-green-100 text-green-700';
            break;
          case 'Rejected':
            colorClass = 'bg-red-100 text-red-600';
            break;
          default:
            colorClass = 'bg-yellow-100 text-yellow-700';
        }

        span.innerText = status;
        span.className = `px-3 py-1 text-xs font-semibold rounded-full ${colorClass}`;

        return span;
      }
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

        if (params.data.status === 'Pending') {

          const createBtn = (icon: string, color: string, clickFn: () => void) => {
            const btn = document.createElement('button');
            btn.innerHTML = `<span class="material-icons text-base ${color}">${icon}</span>`;
            btn.className = 'p-1 hover:bg-gray-100 rounded';
            btn.onclick = clickFn;
            return btn;
          };

          container.appendChild(
            createBtn('check_circle', 'text-green-600', () =>
              this.approve(params.data.id)
            )
          );

          container.appendChild(
            createBtn('cancel', 'text-red-500', () =>
              this.reject(params.data.id)
            )
          );
        }

        return container;
      }
    }
  ];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    this.service.getAllLeaves().subscribe({
      next: (res: any) => {
        this.rowData = res?.data?.items || [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  approve(id: number) {
    this.isProcessing = true;

    this.service.approveLeave(id).subscribe({
      next: () => {
        this.notification.success('Leave approved');
        this.loadData();
        this.isProcessing = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Failed to approve');
        this.isProcessing = false;
        this.cdr.markForCheck();
      }
    });
  }

  reject(id: number) {
    this.isProcessing = true;

    this.service.rejectLeave(id).subscribe({
      next: () => {
        this.notification.success('Leave rejected');
        this.loadData();
        this.isProcessing = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Failed to reject');
        this.isProcessing = false;
        this.cdr.markForCheck();
      }
    });
  }
}