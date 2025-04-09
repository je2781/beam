import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsNegative, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class TransactionDto{
    @IsString()
    @ApiProperty({ example: 'withdrawal', description: 'The type of transaction taking place' })
    trans_type: string;

    @IsDate()
    @ApiProperty({ example: '2023-05-10T09:31:00Z', description: 'The date the transaction occured' })
    date: Date;

    @IsString()
    @ApiProperty({ example: 'pending', description: 'The status of the transaction' })
    status: string;

    @IsNumber()
    @IsNegative()
    @ApiProperty({ example: 500, description: 'The amount used during transaction' })
    amount: number;

}