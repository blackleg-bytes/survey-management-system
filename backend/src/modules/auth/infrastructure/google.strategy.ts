import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";

export interface GoogleProfile {
  id: string;
  emails?: Array<{ value: string }>;
  displayName?: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>("GOOGLE_CLIENT_ID") || "",
      clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET") || "",
      callbackURL: configService.get<string>("GOOGLE_CALLBACK_URL") || "",
      scope: ["email", "profile"],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: GoogleProfile,
  ): GoogleProfile {
    return profile;
  }
}
