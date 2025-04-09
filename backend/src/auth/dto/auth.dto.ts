import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AuthDto{
    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'John Doe', description: 'The fullname of user' })
    full_name?: string;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the user' })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'password', description: 'The passwprd of the user' })
    password: string;
}