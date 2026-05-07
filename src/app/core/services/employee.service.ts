import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  // ================= ADMIN =================


  getEmployees(): Observable<ApiResponse<Employee[]>> {
    return this.http.get<ApiResponse<Employee[]>>(`${this.baseUrl}${API_ENDPOINTS.ADMIN.EMPLOYEES}`);
  }

  createEmployee(data: any) {
    return this.http.post(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.EMPLOYEES}`,
      data
    );
  }

  updateEmployee(id: number, data: any) {
    return this.http.put(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.EMPLOYEE_BY_ID(id)}`,
      data
    );
  }

  updateStatus(userId: number, isActive: boolean, reason: string) {
    const params = new HttpParams()
      .set('isActive', isActive)
      .set('reason', reason);

    return this.http.patch(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.EMPLOYEE_STATUS(userId)}`,
      {},
      { params }
    );
  }

  resetPassword(email: string, newPassword: string, confirmPassword: string) {
    return this.http.post(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.RESET_PASSWORD}`,
      {
        email: email,
        newPassword: newPassword,
        confirmPassword: confirmPassword
      }
    );
  }

  getAdminDashboardSummary() {
    return this.http.get(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.DASHBOARD}`
    );
  }

  // ================= EMPLOYEE =================

  getProfile() {
    return this.http.get(
      `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.PROFILE}`
    );
  }

  updateProfile(data: any) {
    return this.http.put(
      `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.EDIT_PROFILE}`,
      data
    );
  }

  changePassword(data: any) {
    return this.http.post(
      `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.CHANGE_PASSWORD}`,
      data
    );
  }

  getEmployeeDashboardSummary() {
    return this.http.get(
      `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.DASHBOARD}`
    );
  }
}