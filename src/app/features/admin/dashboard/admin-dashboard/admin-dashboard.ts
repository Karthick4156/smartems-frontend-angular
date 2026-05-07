import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [CommonModule, MatIconModule, MatProgressSpinner],
  templateUrl: './admin-dashboard.html'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {

  summary: any;
  isLoading = false;
  errorMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef   // ✅ added
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.cdr.markForCheck(); // optional (only useful with OnPush)

    this.dashboardService.getAdminSummary()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.summary = res.data;
          this.isLoading = false;
          this.cdr.detectChanges(); // ✅ force UI update
        },
        error: () => {
          this.errorMessage = 'Failed to load dashboard';
          this.isLoading = false;
          this.cdr.detectChanges(); // ✅ force UI update
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}