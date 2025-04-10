import { Body, Controller, Get, Patch, Req, UseGuards } from "@nestjs/common";
import { GetUser } from "../auth/decorator";
import { JwtGaurd } from "../auth/guard";
import { UserService } from "./user.service";
import { User } from "./user.entity";

@UseGuards(JwtGaurd)
@Controller("users")
export class UserController {
  constructor(private userService: UserService){

  }
  @Get("me")
  getMe(@GetUser() user: User) {
    return user;
  }

}
