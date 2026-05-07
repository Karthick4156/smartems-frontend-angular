import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { guestGuard } from '../../core/guards/guest-guard';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard]
  }
];