import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { GetUser } from "../auth/decorator";
import { WalletService } from "./wallet.service";
import { TransactionDto } from "../transaction/dto/trans.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Wallet } from "./wallet.entity";
import { JwtGaurd } from "../auth/guard";
import { Transaction } from "../transaction/entities/transaction.entity";

@ApiTags('wallet') // Groups endpoints under "wallet" in Swagger UI
@UseGuards(JwtGaurd)
@Controller('wallet')
export class WalletController{
    constructor(private walletService: WalletService){

    }

    @HttpCode(HttpStatus.OK)
    @Get('balance')
    @ApiOperation({ summary: 'get user wallet balance' })
    @ApiResponse({ status: 200, description: 'Balance retrieved successfully.', type: Object })
    getBalance(@GetUser('id') userId: string){
        return this.walletService.getBalance(userId);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('fund')
    @ApiOperation({ summary: 'Depositing funds' })
    @ApiResponse({ status: 201, description: 'Funds have been deposited', type: Object})
    @ApiBody({ type: TransactionDto })
    fund(@GetUser('id') userId: string, @Body() trans: TransactionDto){
        return this.walletService.fund(userId,  trans);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('transfer')
    @ApiOperation({ summary: 'Transfering funds to another user' })
    @ApiResponse({ status: 201, description: 'Transfer completed', type: Object})
    @ApiBody({ type: TransactionDto })
    transfer(@GetUser('id') userId: string, @Body() dto: TransactionDto){
        return this.walletService.transfer(dto, userId);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('withdraw')
    @ApiOperation({ summary: 'Withdrawing funds' })
    @ApiResponse({ status: 201, description: 'Funds deducted', type: Object})
    @ApiBody({ type: TransactionDto })
    withdrawal(@GetUser('id') userId: string, @Body() trans: TransactionDto){
        return this.walletService.withdrawal(userId, trans);
    }


}