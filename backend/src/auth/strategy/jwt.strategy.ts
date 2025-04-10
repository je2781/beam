import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { Repository } from "typeorm";
import { User } from "../../user/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>
  ) {
    super({
      jwtFromRequest: JwtStrategy.extractFromHeaderOrCookie,
      secretOrKey: config.get("JWT_SECRET"),
    });
  }

  private static extractFromHeaderOrCookie(req: Request): string | null {
    // Try Authorization header first
    const authHeader = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (authHeader) return authHeader;

    // Fallback to cookie
    if (req.cookies && req.cookies['access_token']) {
      return req.cookies['access_token'];
    }

    return null;
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });

    if (user) {
      delete user.hash;
    }

    return user;
  }
}
