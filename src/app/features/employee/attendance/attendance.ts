import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AttendanceService } from '../../../core/services/attendance.service';
import { AgGridAngular } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [AgGridAngular, CommonModule],
  templateUrl: "attendance.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttendanceComponent implements OnInit {

  today: any;
  attendance: any[] = [];
  message = '';
  errorMessage = '';
  canPunchIn = true;
  canPunchOut = false;

  constructor(
    private service: AttendanceService,
    private cdr: ChangeDetectorRef
  ) { }

  columnDefs = [
    {
      field: 'date',
      headerName: 'Date',
      cellClass: 'text-center',
      valueFormatter: (p: any) =>
        p.value
          ? new Date(p.value).toLocaleDateString('en-IN', {
            timeZone: 'Asia/Kolkata'   // ✅ added
          })
          : ''
    },
    {
      field: 'punchIn',
      headerName: 'Punch In',
      cellClass: 'text-center',
      valueFormatter: (p: any) => {
        if (!p.value) return '-';

        const utcDate = new Date(p.value + 'Z'); // ✅ force UTC
        return utcDate.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }
        );
      }

    },
    {
      field: 'punchOut',
      headerName: 'Punch Out',
      cellClass: 'text-center',
      valueFormatter: (p: any) => {
        if (!p.value) return '-';

        const utcDate = new Date(p.value + 'Z'); // ✅ force UTC
        return utcDate.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      }
    },
    { field: 'workHours', headerName: 'Work Hours', cellClass: 'text-center' },
    {
      field: 'status',
      headerName: 'Status',
      cellClass: 'text-center'
    }
  ];

  ngOnInit() {
    this.loadAttendance();
  }

  loadAttendance() {
    this.service.getMyAttendance().subscribe({
      next: (res: any) => {
        this.attendance = res?.data || [];

        const todayStr = new Date().toDateString();

        this.today = this.attendance.find((a: any) => {
          return new Date(a.date).toDateString() === todayStr;
        }) || null;

        if (!this.today) {
          this.canPunchIn = true;
          this.canPunchOut = false;
        } else if (this.today.punchIn && !this.today.punchOut) {
          this.canPunchIn = false;
          this.canPunchOut = true;
        } else {
          this.canPunchIn = false;
          this.canPunchOut = false;
        }

        this.cdr.markForCheck();
      },
      error: (err: any) => {
        console.error('Failed to load attendance:', err);
        this.errorMessage = 'Failed to load attendance data';
        this.attendance = [];

        this.cdr.markForCheck();
      }
    });
  }

  punchIn() {
    setTimeout(() => {
      this.message = '';
      this.errorMessage = '';
      this.cdr.markForCheck();
    }, 3000);

    this.service.punchIn().subscribe({
      next: () => {
        this.message = 'Punched In successfully ✅';
        this.loadAttendance();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Punch In failed';
        this.cdr.markForCheck();
      }
    });
  }

  punchOut() {
    setTimeout(() => {
      this.message = '';
      this.errorMessage = '';
      this.cdr.markForCheck();
    }, 3000);

    this.service.punchOut().subscribe({
      next: () => {
        this.message = 'Punched Out successfully ✅';
        this.loadAttendance();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Punch Out failed';
        this.cdr.markForCheck();
      }
    });
  }

  formatTime(time: string) {
    if (!time) return '-';

    const utcDate = time.endsWith('Z') ? new Date(time) : new Date(time + 'Z');

    return utcDate.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
}