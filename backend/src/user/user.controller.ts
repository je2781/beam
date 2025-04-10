import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Req, UseGuards } from "@nestjs/common";
import { GetUser } from "../auth/decorator";
import { JwtGaurd } from "../auth/guard";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@UseGuards(JwtGaurd)
@ApiTags('users') 
@Controller("users")
export class UserController {
  constructor(private userService: UserService){

  }
  @HttpCode(HttpStatus.OK)
  @Get('me')
  @ApiOperation({ summary: 'getting user' })
  @ApiResponse({ status: 200, description: 'user data retrieved', type: User})
  getMe(@GetUser() user: User) {
    return user;
  }

}
