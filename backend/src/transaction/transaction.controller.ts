import { Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { GetUser } from "src/auth/decorator";
import { TransactionService } from "./transaction.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Transaction } from "src/transaction/transaction.entity";
import { JwtGaurd } from "src/auth/guard";

@ApiTags('transactions') 
@UseGuards(JwtGaurd)
@Controller('transactions')
export class TransactionController{
    constructor(private transService: TransactionService){

    }

    @HttpCode(HttpStatus.OK)
    @Get()
    @ApiOperation({ summary: 'getting transactions' })
    @ApiResponse({ status: 200, description: 'Transactions retrieved', type: Transaction})
    getTransactions(@GetUser('id') userId: string){
        return this.transService.getTransactions(userId);
    }


}