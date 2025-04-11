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
import { User } from "../user/user.entity";

import { Response } from "express";
import { InjectRepository } from "@nestjs/typeorm";
import { Wallet } from "../wallet/wallet.entity";

@Injectable({})
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}
  async login(user: User) {
    try {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const secret = this.config.get("JWT_SECRET");

    const token = this.jwt.sign(payload, {
      secret: secret,
    
    });

    return {token };
    } catch (error) {
      throw error;
    }
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

      delete user.hash;

      return user;
    } catch (error) {
      throw error;
    }
  }

  async signup(dto: AuthDto) {
    try {
      // Check if the user already exists
      // const existingUser = await this.userRepository.findOne({
      //   where: { email: dto.email },
      // });

      // if (existingUser) {
      //   throw new BadRequestException("Email already in use"); // Better user feedback
      // }

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

  async logout(res: Response) {
    try {

      res.clearCookie('access_token', {
        httpOnly: true,
        secure: this.config.get('NODE_ENV') === 'production',
        sameSite: 'lax',
        path: '/', // Important: match the same path as when you set the cookie
      });
    

      return {
        message: 'logout successful'
      }
    } catch (error) {
      throw error;
    }
  }
}
