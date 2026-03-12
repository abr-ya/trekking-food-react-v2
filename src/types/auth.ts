export type User = {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
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
