import { Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { GetUser } from "../auth/decorator";
import { TransactionService } from "./transaction.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Transaction } from "../transaction/transaction.entity";
import { JwtGaurd } from "../auth/guard";

@ApiTags('transactions') 
@UseGuards(JwtGaurd)
@Controller('transactions')
export class TransactionController{
    constructor(private transService: TransactionService){

    }

    @HttpCode(HttpStatus.OK)
    @Get()
    @ApiOperation({ summary: 'getting transactions' })
    @ApiResponse({ status: 200, description: 'Transactions retrieved', type: Array})
    getTransactions(@GetUser('id') userId: string){
        return this.transService.getTransactions(userId);
    }


}