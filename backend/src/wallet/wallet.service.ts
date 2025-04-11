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
import { Bank } from "src/user/bank.entity";

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
    await this.userRepository.update(user, {
      wallet: {
        balance: user.wallet.balance + dto.amount,
      },
    });

    //creating bank entry if user doesnt have one
    if (!user.bank) {
      const newBank = new Bank({
        cvv: dto.bank.cvv,
        card_expiry_date: dto.bank.card_expiry_date,
        card_no: dto.bank.card_no,
      });

      //adding new bank to user repo
      await this.userRepository.update(user, {
        bank: newBank,
      });
    }

    //removing bank details
    delete dto.bank;

    //creating transaction entry
    const newTransaction = new Transaction({
      ...dto,
      date: new Date(dto.date),
    });
    //adding new transaction to user repo
    // user.transactions.push(newTransaction);

    await this.userRepository.update(user, {
      transactions: [...user.transactions, newTransaction],
    });

    return {
      message: "success",
      wallet_balance: user.wallet.balance,
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
    await this.userRepository.update(user, {
      wallet: {
        balance: balance,
      },
    });

    //creating bank entry if user doesnt have one
    if (!user.bank) {
      const newBank = new Bank({
        cvv: dto.bank.cvv,
        card_expiry_date: dto.bank.card_expiry_date,
        card_no: dto.bank.card_no,
      });

      //adding new bank to user repo
      await this.userRepository.update(user, {
        bank: newBank,
      });
    }

    //removing bank details
    delete dto.bank;

    //creating transaction entry
    const newTransaction = new Transaction({
      ...dto,
      date: new Date(dto.date),
    });

    //adding new transaction to user repo
    const savedUser = await this.userRepository.update(user, {
      transactions: [...user.transactions, newTransaction],
    });

    return {
      message: "success",
      wallet_balance: user.wallet.balance,
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
    await this.userRepository.update(creditor, {
      wallet: {
        balance: balance,
      },
    });

    //creating bank entry if creditor doesnt have one
    if (!creditor.bank) {
      const newBank = new Bank({
        cvv: dto.bank.cvv,
        card_expiry_date: dto.bank.card_expiry_date,
        card_no: dto.bank.card_no,
      });

      //adding new bank to creditor repo
      await this.userRepository.update(creditor, {
        bank: newBank,
      });
    }

    //removing bank details
    delete dto.bank;

    //retrieving debtor details
    const debtor = await this.userRepository.findOneBy({
      email: dto.email,
    });

    if (!debtor) {
      throw new UnauthorizedException("Your debtor doesn't exist");
    }
    //updating debtor
    await this.userRepository.update(debtor, {
      wallet: {
        balance: debtor.wallet.balance + dto.amount,
      },
    });

    //creating transaction entry
    const newTransaction = new Transaction({
      ...dto,
      date: new Date(dto.date),
    });

    //adding new transaction to creditor
    const savedCreditor = await this.userRepository.update(creditor, {
      transactions: [...creditor.transactions, newTransaction],
    });

    return {
      message: "success",
      wallet_balanc: creditor.wallet.balance,
    };
  }
}
