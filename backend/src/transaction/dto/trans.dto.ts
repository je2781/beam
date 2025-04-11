import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsNegative, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { Bank } from "../../user/bank.entity";

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
    @IsNegative()
    @ApiProperty({ example: 500, description: 'The amount used during transaction' })
    amount: number;

    @ApiProperty({ example: {
        id: '8484902-U002202-38902',
        cvv: 123,
        card_no: 133839201,
        card_expiry_date: '1/5/2029'
    }, description: 'The bank info involved in the transaction' })
    bank: Bank;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'test@test.com', description: 'The email of the debtor' })
    email?: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ example: 'hi there!', description: 'extra information regarding the transfer' })
    note?: string;

}