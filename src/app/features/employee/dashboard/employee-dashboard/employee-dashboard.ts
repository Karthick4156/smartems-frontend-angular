import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { EmployeeService } from '../../../../core/services/employee.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './Employee-dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeDashboardComponent implements OnInit {

  data: any;
  isLoading = false;
  errorMessage = '';

  constructor(
    private service: EmployeeService,
    private cdr: ChangeDetectorRef   // ✅ added
  ) { }

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck(); // ✅ reflect loading state

    this.service.getEmployeeDashboardSummary().subscribe({
      next: (res: any) => {
        this.data = res.data;
        console.log(res.data);
        this.isLoading = false;
        this.cdr.markForCheck(); // ✅ update UI
      },
      error: (err: any) => {
        console.error('Failed to load dashboard:', err);
        this.errorMessage = 'Failed to load dashboard data';
        this.isLoading = false;
        this.cdr.markForCheck(); // ✅ update UI
      }
    });
  }

  formatIST(time: string | null | undefined) {
    if (!time) return '-';

    const normalized = time.endsWith('Z') ? time : time + 'Z';

    return new Date(normalized).toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
}