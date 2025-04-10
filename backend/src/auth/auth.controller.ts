import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { Response } from "express";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "../user/user.entity";
import { GetUser } from "./decorator";
import { LocalAuthGuard } from "./guard/local.guard";

@ApiTags('auth') 
@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){

    }

    // @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'logging in' })
    @ApiResponse({ status: 201, description: 'Authentication successful', type: User})
    @ApiBody({ type: User })
    @Post('login')
    signin(
        @GetUser() user: User,
      @Res({ passthrough: true }) response: Response,
    ) {
      return this.authService.login(user, response);
    }

    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'registering new account' })
    @ApiResponse({ status: 201, description: 'Registration successful', type: User})
    @ApiBody({ type: AuthDto })
    @Post('register')
    signup(@Body() dto: AuthDto){
        return this.authService.signup(dto);
    }


    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'ending current session' })
    @ApiResponse({ status: 201, description: 'Logout successful', type: User})
    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response){
        return this.authService.logout(res);
    }
}