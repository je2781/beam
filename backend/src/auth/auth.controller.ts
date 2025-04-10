import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { Response } from "express";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "../user/user.entity";
import { GetUser } from "./decorator";
import { LocalAuthGuard } from "./guard/local.guard";
import { ConfigService } from "@nestjs/config";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private config: ConfigService
  ) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "logging in" })
  @ApiResponse({
    status: 201,
    description: "Authentication successful",
    type: User,
  })
  @ApiBody({ type: User })
  @Post("login")
  async signin(
    @GetUser() user: User,
    @Res({ passthrough: true }) response: Response
  ) {
    const { token } = await this.authService.login(user);

    response.cookie("access_token", token, {
      secure: false,
      sameSite: "lax",
      httpOnly: true,
      path: '/',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    return { message: 'success' };
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "registering new account" })
  @ApiResponse({
    status: 201,
    description: "Registration successful",
    type: User,
  })
  @ApiBody({ type: AuthDto })
  @Post("register")
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "ending current session" })
  @ApiResponse({ status: 201, description: "Logout successful", type: User })
  @Post("logout")
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }
}
