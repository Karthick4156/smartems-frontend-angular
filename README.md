# SmartEMS Angular Frontend

SmartEMS is a full-stack Employee Management System frontend built using Angular and Tailwind CSS.

This frontend communicates with REST APIs developed in both ASP.NET Core and Flask backends to provide employee management, attendance tracking, leave workflows, and attendance correction management.

---

# 🚀 Features

## Authentication
- JWT Login
- Role-Based Navigation
- Route Guards
- Secure API Access

---

## Admin Features
- Admin Dashboard
- Employee Management
- Create Employee
- Edit Employee
- Activate / Deactivate Employees
- Reset Password
- Leave Approval Workflow
- Attendance Correction Approval

---

## Employee Features
- Employee Dashboard
- Profile Management
- Change Password
- Attendance Punch In / Punch Out
- Attendance Calendar
- Apply Leave
- Request Attendance Correction
- View Leave & Correction History

---

# 🛠️ Tech Stack

- Angular
- TypeScript
- Tailwind CSS
- Angular Material
- AG Grid
- RxJS
- JWT Authentication
- REST API Integration

---

# 🏗️ Frontend Architecture

The frontend follows modular component-based architecture.

```text
Pages → Components → Services → API
```

---

# 📁 Folder Structure

## core/
Contains:
- services
- interceptors
- guards

---

## features/
Contains feature modules:
- auth
- admin
- employee
- attendance
- leave
- corrections

---

## shared/
Reusable shared components and utilities.

---

# 🔐 Authentication Flow

- User logs in using email & password
- Backend returns JWT token
- Token stored in localStorage
- HTTP interceptor attaches token to API requests
- Route guards protect authorized routes

---

# 📊 UI Features

- Responsive Dashboard
- AG Grid Tables
- Loading States
- Toast Notifications
- Calendar Attendance View
- Role-Based Sidebar

---

# 🌐 Backend Integration

This frontend supports:
- ASP.NET Core Backend
- Flask Backend

API communication is handled through Angular services using HttpClient.

---

# ⚙️ Setup Instructions

## 1. Clone Repository

```bash
git clone <repo-url>
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Start Angular Development Server

```bash
ng serve
```

---

# 🌐 Frontend URL

```text
http://localhost:4200
```

---

# 🔗 Backend API

Update API base URL inside:

```text
src/environments/
```

---

# 📸 Screenshots

Add screenshots later:
- Login Page
- Dashboard
- Attendance Page
- Employee Management
- Leave Management

---

# 🎯 Learning Outcome

This project helped me understand:
- Angular Component Architecture
- State Management using RxJS
- API Integration
- JWT Authentication Flow
- Role-Based UI Rendering
- Reusable UI Components
- Frontend Performance Optimization

---

# 👨‍💻 Author

Karthick K
