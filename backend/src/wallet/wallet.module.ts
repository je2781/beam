import { Module } from "@nestjs/common";
import { WalletController } from "./wallet.controller";
import { WalletService } from "./wallet.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Wallet } from "src/wallet/wallet.entity";
import { Transaction } from "src/transaction/transaction.entity";
import { User } from "src/user/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction, User])],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
