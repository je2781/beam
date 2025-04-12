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
import { Bank } from "../user/bank.entity";
import { TransactionCounter } from "../transaction/transaction-counter.entity";

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private transRepository: Repository<Transaction>,
    @InjectRepository(Bank)
    private bankRepository: Repository<Bank>,
    @InjectRepository(TransactionCounter)
    private counterRepo: Repository<TransactionCounter>
  ) {}

  async getNextTransactionId(): Promise<string> {
    let counterRow = await this.counterRepo.findOne({ where: { id: 1 } });

    if (!counterRow) {
      counterRow = this.counterRepo.create({ counter: 1 });
    } else {
      counterRow.counter += 1;
    }

    await this.counterRepo.save(counterRow);

    const padded = counterRow.counter.toString().padStart(6, '0');
    return `TXN${padded}`;
  }

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
      relations: { wallet: true, bank: true, transactions: true },
    });

    if (!user) {
      throw new UnauthorizedException("credentials incorrect");
    }

    //creating bank entry if user doesnt have one

    if (!user.bank) {
      const newBank = this.bankRepository.create({
        cvv: dto.cvv,
        card_expiry_date: dto.card_expiry_date,
        card_no: dto.card_no,
        user: user,
      });

      await this.bankRepository.save(newBank);
    }

    //updating wallet
    if (user.wallet) {
      const balance = user.wallet.balance + dto.amount;

      user.wallet.balance = balance;
      await this.userRepository.save(user);
    }

    //removing bank details
    delete dto.card_expiry_date;
    delete dto.card_no;
    delete dto.cvv;

    //creating transaction entry
    const transId = await this.getNextTransactionId();
    const newTrans = this.transRepository.create({
      ...dto,
      date: new Date(dto.date),
      id: transId,
      user: user,
    });

    await this.transRepository.save(newTrans);


    return {
      message: "success",
      wallet_balance: user.wallet.balance,
    };
  }

  async withdrawal(userId: string, dto: TransactionDto) {
    const user = await this.userRepository.findOne({
      where: {id: userId},
      relations: { wallet: true, bank: true, transactions: true },
    });

    if (!user) {
      throw new UnauthorizedException("credentials incorrect");
    }

    //first creating bank entry if user doesnt have one

    if (!user.bank) {
      const newBank = this.bankRepository.create({
        cvv: dto.cvv,
        card_expiry_date: dto.card_expiry_date,
        card_no: dto.card_no,
        user: user,
      });

      await this.bankRepository.save(newBank);

    }

    //updating wallet
    if (user.wallet) {
      const balance = user.wallet.balance - dto.amount;
      //checking funds in wallet
      if (balance < 0) {
        throw new ForbiddenException("insuffient funds for withdrawal");
      }

      user.wallet.balance = balance;
      await this.userRepository.save(user);
    }

    //removing bank details
    delete dto.card_expiry_date;
    delete dto.card_no;
    delete dto.cvv;

    //creating transaction entry
    const transId = await this.getNextTransactionId();
    const newTrans = this.transRepository.create({
      ...dto,
      date: new Date(dto.date),
      id: transId,
      user: user,
    });

    await this.transRepository.save(newTrans);

    return {
      message: "success",
      wallet_balance: user.wallet.balance,
    };
  }

  async transfer(dto: TransactionDto, userId: string) {
    //retrieving creditor details
    const creditor = await this.userRepository.findOne({
      where: {id: userId},
      relations: { wallet: true, bank: true, transactions: true },
    });

    if (!creditor) {
      throw new UnauthorizedException("credentials incorrect");
    }

    //first creating bank entry if creditor doesnt have one
    if (!creditor.bank) {
      const newCreditorBank = this.bankRepository.create({
        cvv: dto.cvv,
        card_expiry_date: dto.card_expiry_date,
        card_no: dto.card_no,
        user: creditor,
      });

      await this.bankRepository.save(newCreditorBank);

    }

    //updating creditor wallet
    if (creditor.wallet) {
      const balance = creditor.wallet.balance - dto.amount;
      //checking  funds in wallet
      if (balance < 0) {
        throw new ForbiddenException("insuffient funds for transfer");
      }

      creditor.wallet.balance = balance;
      await this.userRepository.save(creditor);
    }

    //removing bank details
    delete dto.card_expiry_date;
    delete dto.card_no;
    delete dto.cvv;

    //creating transaction entry
    const transId = await this.getNextTransactionId();
    const newCreditorTrans = this.transRepository.create({
      ...dto,
      date: new Date(dto.date),
      id: transId,
      user: creditor,
    });

    await this.transRepository.save(newCreditorTrans);

    //-----------------------------------------------------------------------------//

    //retrieving debtor details
    const debtor = await this.userRepository.findOne({
      where: {email: dto.email},
      relations: { wallet: true, bank: true, transactions: true },
    });

    if (!debtor) {
      throw new UnauthorizedException("Your debtor doesn't exist");
    }

    //updating debtor wallet
    if (debtor.wallet) {
      debtor.wallet.balance += dto.amount;
      await this.userRepository.save(debtor);
    }

    return {
      message: "success",
      wallet_balance: creditor.wallet.balance,
    };
  }
}
