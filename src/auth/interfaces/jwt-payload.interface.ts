export interface JwtPayload {
  userId: number;
  email: string;
  iat: string;
  exp: string;
}
