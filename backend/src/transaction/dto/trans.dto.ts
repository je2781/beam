import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsNegative, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class TransactionDto{
    @IsString()
    @ApiProperty({ example: 'withdrawal', description: 'The type of transaction taking place' })
    trans_type: string;

    @IsString()
    @ApiProperty({ example: '2023-05-10T09:31:00Z', description: 'The date the transaction occured' })
    date: string;

    @IsString()
    @ApiProperty({ example: 'pending', description: 'The status of the transaction' })
    status: string;

    @IsNumber()
    @IsPositive()
    @ApiProperty({ example: 500, description: 'The amount used during transaction' })
    amount: number;

    @IsNumber()
    @IsOptional()
    @IsPositive()
    @ApiProperty({ example: 500, description: 'The security strip at the back of the card' })
    cvv?: number;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: '7892029992', description: 'The the bank card number' })
    card_no?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: '3/4/2038', description: 'The date the card becomes invalid' })
    card_expiry_date?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'test@test.com', description: 'The email of the debtor' })
    email?: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ example: 'hi there!', description: 'extra information regarding the transfer' })
    note?: string;

}