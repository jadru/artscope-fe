export type loginResponseType = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
  token_type: 'Bearer';
};

export type loginRequestType = {
  username: string;
  password: string;
};

export type decodedAccessTokenType = {
  sub: string;
  exp: number;
  auth: string;
};

export type decodedRefreshTokenType = {
  sub: string;
  typ: 'refresh';
  exp: number;
};

export type roleType = (
  | 'ROLE_GUEST'
  | 'ROLE_USER'
  | 'ROLE_ARTIST'
  | 'ROLE_ADMIN'
)[];
