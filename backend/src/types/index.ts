// User types for SnapHire
export interface User {
  user_id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface UserWithoutPassword {
  user_id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
