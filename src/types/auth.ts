
export type UserRole = 'admin' | 'procurement_officer' | 'committee_member' | 'evaluator' | 'bidder';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  employeeId?: string;
  permissions: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token?: string;
}
