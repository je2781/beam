import { ConflictException, ForbiddenException, Injectable, InternalServerErrorException, } from "@nestjs/common";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Repository, TypeORMError } from "typeorm";
import { User } from "typeorm/user.entity";
import * as crypto from 'crypto';

import { Response } from "express";
import { InjectRepository } from "@nestjs/typeorm";
import { Wallet } from "typeorm/wallet.entity";

@Injectable({})
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>
  ) {}
  async login(dto: AuthDto, res: Response) {
    const user = await this.userRepository.findOneBy({
      email: dto.email,
    });

    if (!user) {
      throw new ForbiddenException("Credential incorrect");
    }

    const isMatch = await argon.verify(user.hash!, dto.password);

    if (!isMatch) {
      throw new ForbiddenException("Credential incorrect");
    }

    // delete user.hash;

    return this.signToken(user.id, user.email, res);
  }

  async signup(dto: AuthDto) {
    try {
      const hash = await argon.hash(dto.password);
      const newUser = await this.userRepository.create({
        hash: hash,
        email: dto.email,
        full_name: dto.full_name,
        id: (await crypto.randomBytes(6)).toString("hex"),
      });

      newUser.wallet = await this.walletRepository.create({
        id: (await crypto.randomBytes(6)).toString("hex"),
      }); // Create and attach wallet

      return this.userRepository.save(newUser);
    } catch (err) {
      console.error('Signup error:', err);

      // MySQL unique constraint violation
      if (err.code === 'ER_DUP_ENTRY') {
        throw new ConflictException("Credential already taken");
      }
  
      throw new InternalServerErrorException("Something went wrong");

    }
  }

  async signToken(userId: string, email: string, response: Response) {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get("JWT_SECRET");

    const token = await this.jwt.signAsync(payload, {
      expiresIn: 900,
      secret: secret,
    });

    response.cookie("access_token", token, {
      httpOnly: true, // Prevents JS access to the cookie
      secure: process.env.NODE_ENV === "production", // Only over HTTPS in production
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    return {
      message: "success",
    };
  }
}
