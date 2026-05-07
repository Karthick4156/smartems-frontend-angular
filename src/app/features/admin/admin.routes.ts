import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { roleGuard } from '../../core/guards/role-guard';
import { AdminLayoutComponent } from '../../layouts/admin-layout/admin-layout';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Admin' },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../admin/dashboard/admin-dashboard/admin-dashboard')
            .then(m => m.AdminDashboardComponent)
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('./employees/employees')
            .then(m => m.EmployeesComponent)
      },
      {
        path: 'leaves',
        loadComponent: () =>
          import('./leaves/leaves')
            .then(m => m.LeavesComponent)
      },
      {
        path: 'corrections',
        loadComponent: () =>
          import('./corrections/corrections')
            .then(m => m.CorrectionsComponent)
      }
    ]
  }
];