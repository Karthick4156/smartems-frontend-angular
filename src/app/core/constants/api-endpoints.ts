export const API_ENDPOINTS = {

  AUTH: {
    LOGIN: '/auth/login'
  },

  ADMIN: {
    EMPLOYEES: '/admin/employees',
    EMPLOYEE_BY_ID: (id: number) => `/admin/employees/${id}`,
    EMPLOYEE_STATUS: (userId: number) => `/admin/employees/${userId}/status`,
    RESET_PASSWORD: '/admin/employees/reset-password',
    DASHBOARD: '/admin/employees/dashboard-summary',

    LEAVES: '/admin/leaves',
    APPROVE_LEAVE: (id: number) => `/admin/leaves/${id}/approve`,
    REJECT_LEAVE: (id: number) => `/admin/leaves/${id}/reject`,

    CORRECTIONS: '/admin/corrections',
    APPROVE_CORRECTION: (id: number) => `/admin/corrections/${id}/approve`,
    REJECT_CORRECTION: (id: number) => `/admin/corrections/${id}/reject`
  },

  EMPLOYEE: {
    PROFILE: '/employee/profile',
    EDIT_PROFILE: '/employee/profile-edit',
    CHANGE_PASSWORD: '/employee/change-password',
    DASHBOARD: '/employee/dashboard-summary',

    ATTENDANCE: {
      PUNCH_IN: '/employee/attendance/punch-in',
      PUNCH_OUT: '/employee/attendance/punch-out',
      GET: '/employee/attendance'
    },

    LEAVES: '/employee/leaves',
    CORRECTION: '/employee/correction'
  },

  COMMON: {
    DEPARTMENTS: '/departments',
    DESIGNATIONS_BY_DEPT: (deptId: number) =>
      `/designations/by-department/${deptId}`
  }

};