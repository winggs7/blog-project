import { EStatus } from 'src/constant/enum';

export type AuthPayLoad = {
  iat: number;
  uid: string;
  claims: {
    user_id: string;
    username: string;
  };
};

export type AuthUser = {
  id: string;
  username: string;
  full_name: string;
  scope: string;
  role: EStatus;
};

export type AuthToken = {
  accessToken: string;
  accessTokenExpiresAt: Date;
  refreshToken?: string;
  refreshTokenExpiresAt?: Date;
  user: Partial<AuthUser>;
};

export type AuthBody = {
  scope: string;
  username?: string;
  password?: string;
  access_token?: string;
};
