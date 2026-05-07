export interface Employee {
  id: number;
  employeeCode: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  status: string | number;
  inactiveReason?: string;
}