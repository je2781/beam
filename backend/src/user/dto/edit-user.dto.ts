import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class EditUserDto{
    @IsEmail()
    @IsOptional()
    @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the debtot' })
    email?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'John Doe', description: 'Then name of user' })
    full_name?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'Fedility Bank', description: 'The bank of the user' })
    bank?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'john.doe@example.com', description: "The bank account number of user" })
    acctNo?: string;

}