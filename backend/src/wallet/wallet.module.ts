import { Module } from "@nestjs/common";
import { WalletController } from "./wallet.controller";
import { WalletService } from "./wallet.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Wallet } from "../wallet/wallet.entity";
import { Transaction } from "../transaction/transaction.entity";
import { User } from "../user/user.entity";
import { Bank } from "../user/bank.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction, User, Bank])],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
