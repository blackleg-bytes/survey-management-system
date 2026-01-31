import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { RedisService, PasswordService } from "@shared/services";
import { randomBytes } from "crypto";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly passwordService: PasswordService,
  ) {}

  signAccessToken(payload: Record<string, unknown>): string {
    const ttl = this.configService.get<number>("ACCESS_TOKEN_TTL", 900);
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_SECRET") || "secret",
      expiresIn: `${ttl}s`,
    });
  }

  async generateRefreshToken(userId: string): Promise<string> {
    const token = randomBytes(48).toString("hex");
    const ttlDays = this.configService.get<number>("REFRESH_TOKEN_TTL_DAYS", 7);
    const ttlSeconds = ttlDays * 24 * 60 * 60;
    await this.redisService.set(
      this.refreshTokenKey(token),
      userId,
      ttlSeconds,
    );
    return token;
  }

  async rotateRefreshToken(
    token: string,
  ): Promise<{ userId: string; newToken: string }> {
    const userId = await this.redisService.get(this.refreshTokenKey(token));
    if (!userId) {
      throw new Error("Invalid refresh token");
    }

    await this.redisService.del(this.refreshTokenKey(token));
    const newToken = await this.generateRefreshToken(userId);

    return { userId, newToken };
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await this.redisService.del(this.refreshTokenKey(token));
  }

  hashPassword(password: string): Promise<string> {
    return this.passwordService.hash(password);
  }

  verifyPassword(password: string, hash: string): Promise<boolean> {
    return this.passwordService.verify(password, hash);
  }

  private refreshTokenKey(token: string): string {
    return `refresh:${token}`;
  }
}
