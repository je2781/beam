import { Body, Controller, HttpCode, HttpStatus, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { Response } from "express";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "typeorm/user.entity";

@ApiTags('auth') 
@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){

    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiOperation({ summary: 'logging in' })
    @ApiResponse({ status: 201, description: 'Authentication successful', type: User})
    @ApiBody({ type: AuthDto })
    @ApiResponse({ type: AuthDto })
    signin(@Body() dto: AuthDto, @Res() res: Response){
        const token = this.authService.login(dto, res);

        return token;
    }

    @Post('register')
    @ApiOperation({ summary: 'registering new account' })
    @ApiResponse({ status: 201, description: 'Registration successful', type: User})
    @ApiBody({ type: AuthDto })
    signup(@Body() dto: AuthDto){
        return this.authService.signup(dto);
    }
}