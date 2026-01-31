export interface ITokenService {
  signToken(payload: any): string;
  verifyToken(token: string): any;
}
