import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ApiResponse } from '../models/api-response.model';
import { DashboardSummary } from '../models/dashboard-summary.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  // ================= ADMIN =================

  getAdminSummary() {
    return this.http.get<ApiResponse<DashboardSummary>>(
      `${this.baseUrl}/admin/employees/dashboard-summary`
    );
  }
}