import { Module } from "@nestjs/common";
import { WalletController } from "./wallet.controller";
import { WalletService } from "./wallet.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Wallet } from "typeorm/wallet.entity";
import { Transaction } from "typeorm/transaction.entity";
import { User } from "typeorm/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction, User])],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
