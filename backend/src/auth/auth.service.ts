import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthDto } from "./dto";
import * as argon2 from "argon2";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Repository } from "typeorm";
import { User } from "src/user/user.entity";
import ms from "ms";

import { Response } from "express";
import { InjectRepository } from "@nestjs/typeorm";
import { Wallet } from "src/wallet/wallet.entity";

@Injectable({})
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}
  async login(user: User, res: Response) {
    const remainingMilliseconds = 36000000; // 10hr
    const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const secret = this.config.get("JWT_SECRET");

    const token = await this.jwt.signAsync(payload, {
      secret: secret,
    });

    res.cookie("Authentication", token, {
      secure: true,
      httpOnly: true,
      expires: expiryDate,
    });

    return { payload };
  }

  async verifyUser(dto: AuthDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: dto.email },
      });

      if (!user) {
        throw new UnauthorizedException("Credentials are not valid.");
      }

      const isMatch = await argon2.verify(user.hash!, dto.password);

      if (!isMatch) {
        throw new UnauthorizedException();
      }

      // delete user.hash;

      return user;
    } catch (error) {
      throw error;
    }
  }

  async signup(dto: AuthDto) {
    try {
      // Check if the user already exists
      const existingUser = await this.userRepository.findOne({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new BadRequestException("Email already in use"); // Better user feedback
      }

      const hash = await argon2.hash(dto.password);
      const newUser = new User({
        hash: hash,
        email: dto.email,
        full_name: dto.full_name,
      });

      newUser.wallet = new Wallet({}); // Create and attach wallet

      const savedUser = await this.userRepository.save(newUser);

      return savedUser;
    } catch (err) {
      throw err;
    }
  }

  async logout(userId: string, res: Response) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new UnauthorizedException("Credentials are not valid.");
      }

      res.cookie("Authentication", null);
    } catch (error) {
      throw error;
    }
  }
}
