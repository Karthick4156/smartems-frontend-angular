import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // ================= MASTER DATA =================

  getDepartments() {
    return this.http.get(
      `${this.baseUrl}${API_ENDPOINTS.COMMON.DEPARTMENTS}`
    );
  }

  getDesignations(departmentId: number) {
    return this.http.get(
      `${this.baseUrl}${API_ENDPOINTS.COMMON.DESIGNATIONS_BY_DEPT(departmentId)}`
    );
  }
}