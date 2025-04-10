import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async getUser(userId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
  
      if (!user) {
        throw new UnauthorizedException("credentials incorrect");
      }
  
      return {
        ...user
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(email: string) {
    try {
      
      await this.userRepository.delete({
        email,
      });
    } catch (error) {
      throw error;
    }
  }
}
