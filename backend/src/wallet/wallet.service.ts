import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../user/user.entity";
import { TransactionDto } from "../transaction/dto/trans.dto";
import { Transaction } from "../transaction/transaction.entity";

import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private transRepository: Repository<Transaction>
  ) {}

  async getBalance(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { wallet: true },
    });

    if (!user) {
      throw new UnauthorizedException("credentials incorrect");
    }

    return {
      message: "success",
      wallet_balance: user.wallet.balance,
    };
  }

  async fund(userId: string, dto: TransactionDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException("credentials incorrect");
    }
    //updating wallet
    user.wallet.balance = user.wallet.balance + dto.amount;

    //creating transaction entry
    const newTransaction = new Transaction({
      ...dto,
      date: new Date(dto.date)
    });
    //adding new transaction to user repo
    user.transactions.push(newTransaction);

    const savedUser = await this.userRepository.save(user);

    return {
      message: "success",
      wallet_balance: savedUser.wallet.balance,
    };
  }

  async withdrawal(userId: string, dto: TransactionDto) {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!user) {
      throw new UnauthorizedException("credentials incorrect");
    }
    const balance = user.wallet.balance - dto.amount;

    //checking funds
    if (balance < 0) {
      throw new ForbiddenException("insuffient funds for withdrawal");
    }

    //updating wallet
    user.wallet.balance = balance;

    //creating transaction entry
    const newTransaction = new Transaction({
      ...dto,
      date: new Date(dto.date)
    });

    //adding new transaction to user repo
    user.transactions.push(newTransaction);

    const savedUser = await this.userRepository.save(user);

    return {
      message: "success",
      wallet_balance: savedUser.wallet.balance,
    };
  }

  async transfer(dto: TransactionDto, userId: string) {
    //retrieving creditor details
    const creditor = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!creditor) {
      throw new UnauthorizedException("credentials incorrect");
    }

    const balance = creditor.wallet.balance - dto.amount;

    //checking funds
    if (balance < 0) {
      throw new ForbiddenException("insuffient funds for transfer");
    }
    //updating creditor wallet
    creditor.wallet.balance = balance;

    const debtor = await this.userRepository.findOneBy({
      email: dto.email,
    });

    if (!debtor) {
      throw new UnauthorizedException("User doesn't exist");
    }
    //current balance of debtor
    debtor.wallet.balance = debtor.wallet.balance + dto.amount;

    //updating debtor
    await this.userRepository.save(debtor);

    //creating transaction entry
    const newTransaction = new Transaction({
      ...dto,
      date: new Date(dto.date)
    });

    //adding new transaction to creditor
    creditor.transactions.push(newTransaction);

    const savedCreditor = await this.userRepository.save(creditor);

    return {
      message: "success",
      wallet_balanc: savedCreditor.wallet.balance,
    };
  }
}
