

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

interface AuthUser {
  uid?: string;
  fullName: string;
  email: string;
  username?: string;
  status?: string;
  phone?: string;
  address?: string;
  document?: string;
  businessName?: string;
  role: AuthRole;
}

interface AuthRole {
  name: string;
  code: string;
  status: string;
}
