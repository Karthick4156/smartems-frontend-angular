import { Routes } from '@angular/router';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes')
      .then(m => m.AUTH_ROUTES)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes')
      .then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'employee',
    loadChildren: () => import('./features/employee/employee.routes')
      .then(m => m.EMPLOYEE_ROUTES)
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: '**',
    component: UnauthorizedComponent
  }
];