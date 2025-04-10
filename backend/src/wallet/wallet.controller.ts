import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { GetUser } from "../auth/decorator";
import { WalletService } from "./wallet.service";
import { TransactionDto } from "../transaction/dto/trans.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Wallet } from "./wallet.entity";
import { JwtGaurd } from "../auth/guard";
import { Transaction } from "../transaction/transaction.entity";

@ApiTags('wallet') // Groups endpoints under "wallet" in Swagger UI
@UseGuards(JwtGaurd)
@Controller('wallet')
export class WalletController{
    constructor(private walletService: WalletService){

    }

    @HttpCode(HttpStatus.OK)
    @Get('balance')
    @ApiOperation({ summary: 'get user wallet balance' })
    @ApiResponse({ status: 200, description: 'Balance retrieved successfully.', type: Wallet })
    getBalance(@GetUser('id') userId: string){
        return this.walletService.getBalance(userId);
    }

    @HttpCode(HttpStatus.OK)
    @Post('fund')
    @ApiOperation({ summary: 'Depositing funds' })
    @ApiResponse({ status: 201, description: 'Funds have been deposited', type: Wallet})
    @ApiBody({ type: TransactionDto })
    fund(@GetUser('id') userId: string, @Body() trans: TransactionDto){
        return this.walletService.fund(userId,  trans);
    }

    @HttpCode(HttpStatus.OK)
    @Patch('transfer')
    @ApiOperation({ summary: 'Transfering funds to another user' })
    @ApiResponse({ status: 201, description: 'Transfer completed', type: Wallet})
    @ApiBody({ type: Transaction })
    transfer(@GetUser('id') userId: string, @Body() dto: Transaction){
        return this.walletService.transfer(dto, userId);
    }

    @HttpCode(HttpStatus.OK)
    @Post('withdraw')
    @ApiOperation({ summary: 'Withdrawing funds' })
    @ApiResponse({ status: 201, description: 'Funds deducted', type: Wallet})
    @ApiBody({ type: TransactionDto })
    withdrawal(@GetUser('id') userId: string, @Body() trans: TransactionDto){
        return this.walletService.withdrawal(userId, trans);
    }


}