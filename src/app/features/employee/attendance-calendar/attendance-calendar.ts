import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AttendanceService } from '../../../core/services/attendance.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendance-calendar.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttendanceCalendarComponent implements OnInit {

  currentDate = new Date();
  days: any[] = [];
  attendance: any[] = [];
  errorMessage = '';

  constructor(
    private service: AttendanceService,
    private cdr: ChangeDetectorRef   // ✅ added
  ) { }

  ngOnInit() {
    this.loadAttendance();
  }

  loadAttendance() {
    this.errorMessage = '';

    this.service.getMyAttendance().subscribe({
      next: (res: any) => {

        if (!res.success) {
          this.errorMessage = res.message;
          this.cdr.markForCheck();
          return;
        }

        this.attendance = res?.data?.items || [];

        this.generateCalendar();
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Failed to load attendance data';
        this.cdr.markForCheck();
      }
    });
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
    const lastDate = new Date(year, month + 1, 0).getDate();

    this.days = [];

    // ✅ Add empty slots before first day
    for (let i = 0; i < firstDay; i++) {
      this.days.push(null);
    }

    // ✅ Fill actual days
    for (let i = 1; i <= lastDate; i++) {
      const date = new Date(year, month, i);

      const record = this.attendance.find(a => {
        const apiDate = new Date(a.date + 'Z'); // force UTC
        return apiDate.toDateString() === date.toDateString();
      });

      this.days.push({
        date,
        status: this.getStatus(date, record)
      });
    }
  }

  getStatus(date: Date, record: any) {

    const today = new Date();

    const current = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    // Future date
    if (checkDate > current) {
      return 'Future';
    }

    // If record exists → always respect it
    if (record) {
      if (checkDate.getTime() === current.getTime()) {
        if (!record.punchOut) return 'InProgress';
      }
      return record.status;
    }

    // Weekend (only if no record)
    if (date.getDay() === 0 || date.getDay() === 6) {
      return 'Weekend';
    }

    // Today but not marked
    if (checkDate.getTime() === current.getTime()) {
      return 'NotMarked';
    }

    // Default
    return 'Absent';
  }

  getColor(status: string) {
    switch (status) {
      case 'FullDay': return 'bg-green-500 text-white';
      case 'HalfDay': return 'bg-yellow-400';
      case 'Absent': return 'bg-red-500 text-white';
      case 'InProgress': return 'bg-blue-500 text-white';
      case 'Weekend': return 'bg-gray-300';
      case 'Future': return 'bg-white text-gray-400 border';
      case 'NotMarked': return 'bg-gray-100';
      default: return 'bg-gray-200';
    }
  }
}