export type User = {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  /** App-level role from Better Auth session (e.g. `"admin"`). */
  role?: string;
};

export type Session = {
  user: User;
  accessToken: string;
  expiresAt: number;
  refreshToken?: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = LoginCredentials & {
  name?: string;
};

export type AuthError = {
  code: string;
  message: string;
};
