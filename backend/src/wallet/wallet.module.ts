import { Module } from "@nestjs/common";
import { WalletController } from "./wallet.controller";
import { WalletService } from "./wallet.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Wallet } from "../wallet/wallet.entity";
import { Transaction } from "../transaction/entities/transaction.entity";
import { User } from "../user/user.entity";
import { Bank } from "../bank/bank.entity";
import { TransactionCounter } from "../transaction/entities/transaction-counter.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction, User, Bank, TransactionCounter])],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
