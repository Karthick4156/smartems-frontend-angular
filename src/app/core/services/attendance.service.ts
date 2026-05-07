import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class AttendanceService {

  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // ================= EMPLOYEE =================

  punchIn() {
    return this.http.post(
      `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.ATTENDANCE.PUNCH_IN}`,
      {}
    );
  }

  punchOut() {
    return this.http.post(
      `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.ATTENDANCE.PUNCH_OUT}`,
      {}
    );
  }

  getMyAttendance() {
    return this.http.get(
      `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.ATTENDANCE.GET}`
    );
  }

  requestCorrection(data: any) {
    return this.http.post(
      `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.CORRECTION}`,
      data
    );
  }

  // ================= ADMIN =================

  getCorrections() {
    return this.http.get(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.CORRECTIONS}`
    );
  }

  approveCorrection(id: number) {
    return this.http.patch(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.APPROVE_CORRECTION(id)}`,
      {}
    );
  }

  rejectCorrection(id: number) {
    return this.http.patch(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.REJECT_CORRECTION(id)}`,
      {}
    );
  }
}