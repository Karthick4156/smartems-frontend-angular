import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterModule, 
    CommonModule, 
    MatIconModule, 
    MatButtonModule,
    MatMenuModule,
    MatDialogModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLayoutComponent {

  isOpen = true;
  profile: any;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  logout() {
    this.authService.logout(); // existing method
    this.router.navigate(['auth/login']); // redirect
  }

}
