import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { roleGuard } from '../../core/guards/role-guard';
import { EmployeeLayoutComponent } from '../../layouts/employee-layout/employee-layout';

export const EMPLOYEE_ROUTES: Routes = [
  {
    path: '',
    component: EmployeeLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Employee' },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/employee-dashboard/employee-dashboard')
            .then(m => m.EmployeeDashboardComponent)
      },
      {
        path: 'leaves',
        loadComponent: () =>
          import('./leaves/leaves')
            .then(m => m.LeavesComponent)
      },
      {
        path: 'attendance',
        loadComponent: () =>
          import('./attendance/attendance')
            .then(m => m.AttendanceComponent)
      },
      {
        path: 'corrections',
        loadComponent: () =>
          import('./corrections/corrections')
            .then(m => m.CorrectionsComponent)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/profile')
            .then(m => m.ProfileComponent)
      },
      {
        path: 'attendance-calendar',
        loadComponent: () =>
          import('./attendance-calendar/attendance-calendar')
            .then(m => m.AttendanceCalendarComponent)
      }
    ]
  }
];