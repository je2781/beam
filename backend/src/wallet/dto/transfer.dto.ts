import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmptyObject, IsNumber, IsOptional, IsString, isNotEmptyObject } from "class-validator";
import { Transaction } from "typeorm/transaction.entity";


export class TransferDto{
    @IsEmail()
    @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the debtot' })
    email?: string;


    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'Hi there', description: 'Additional info for debtor to know' })
    note?: string;

    @IsNotEmptyObject()
    @ApiProperty({ description: 'The transaction details' })
    transaction: Transaction;

}