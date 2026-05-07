import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../core/services/auth.service';
import { EmployeeService } from '../../core/services/employee.service';

import { EditProfileDialogComponent } from '../../shared/components/edit-profile-dialog/edit-profile-dialog';
import { ChangePasswordDialogComponent } from '../../shared/components/change-password-dialog/change-password-dialog';

@Component({
  selector: 'app-employee-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    MatMenuModule,
    MatIconModule
  ],
  templateUrl: './employee-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeLayoutComponent implements OnInit {

  isOpen = true;
  profile: any;

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.employeeService.getProfile().subscribe({
      next: (res: any) => {
        this.profile = res.data;
      },
      error: (err: any) => {
        console.error('Failed to load profile:', err);
        this.profile = null;
      }
    });
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['auth/login']);
  }

  openEditProfile() {
    const dialogRef = this.dialog.open(EditProfileDialogComponent, {
      data: this.profile
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.updateProfile(result)
          .subscribe({
            next: () => this.loadProfile(),
            error: (err: any) => console.error('Failed to update profile:', err)
          });
      }
    });
  }

  openChangePassword() {
    this.dialog.open(ChangePasswordDialogComponent);
  }
}