import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class LeaveService {

  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // ================= EMPLOYEE =================

  applyLeave(data: any) {
    return this.http.post(
      `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.LEAVES}`,
      data
    );
  }

  getMyLeaves() {
    return this.http.get(
      `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.LEAVES}`
    );
  }

  // ================= ADMIN =================

  getAllLeaves() {
    return this.http.get(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.LEAVES}`
    );
  }

  approveLeave(id: number) {
    return this.http.patch(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.APPROVE_LEAVE(id)}`,
      {}
    );
  }

  rejectLeave(id: number) {
    return this.http.patch(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.REJECT_LEAVE(id)}`,
      {}
    );
  }
}