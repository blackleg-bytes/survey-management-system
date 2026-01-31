import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ITokenService } from "@modules/auth/application/interfaces";

@Injectable()
export class JwtTokenServiceImpl implements ITokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  signToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_SECRET") || "secret",
      expiresIn: "1d",
    });
  }

  verifyToken(token: string): any {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>("JWT_SECRET") || "secret",
    });
  }
}
