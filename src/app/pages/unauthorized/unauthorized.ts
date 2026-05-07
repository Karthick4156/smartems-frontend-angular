import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  templateUrl: './unauthorized.html'
})
export class UnauthorizedComponent {

  constructor(private router: Router, private authService: AuthService) { }

  goHome() {
    const role = this.authService.getRole();

    if (role === 'Admin') {
      this.router.navigate(['/admin/dashboard']);
    } else if (role === 'Employee') {
      this.router.navigate(['/employee/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }
}