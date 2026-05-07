import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { EmployeeService } from '../../../core/services/employee.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileDialogComponent } from '../../../shared/components/edit-profile-dialog/edit-profile-dialog';
import { ChangePasswordDialogComponent } from '../../../shared/components/change-password-dialog/change-password-dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  templateUrl: './profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {

  profile: any;
  errorMessage = '';

  constructor(
    private service: EmployeeService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef   // ✅ added
  ) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.getProfile().subscribe({
      next: (res: any) => {
        this.profile = res.data;
        this.cdr.markForCheck(); // ✅ notify Angular
      },
      error: (err: any) => {
        console.error('Failed to load profile:', err);
        this.errorMessage = 'Failed to load profile';
        this.cdr.markForCheck(); // ✅ notify Angular
      }
    });
  }

  openEdit() {
    const dialogRef = this.dialog.open(EditProfileDialogComponent, {
      data: this.profile
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.updateProfile(result).subscribe({
          next: () => {
            this.profile = { ...this.profile, ...result };
            this.cdr.markForCheck();
          },
          error: (err: any) => {
            console.error('Failed to update profile:', err);
            this.errorMessage = 'Failed to update profile';
            this.cdr.markForCheck(); // ✅ notify Angular
          }
        });
      }
    });
  }

openChangePassword() {
  const dialogRef = this.dialog.open(ChangePasswordDialogComponent);

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.service.changePassword(result).subscribe({
        next: () => {
          alert('Password changed successfully');
        },
        error: (err: any) => {
          console.error('Failed to change password:', err);
          this.errorMessage = err?.error?.message || 'Failed to change password';
          this.cdr.markForCheck();
        }
      });
    }
  });
}

}