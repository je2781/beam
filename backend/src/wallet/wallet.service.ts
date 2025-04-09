import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { TransferDto } from "./dto";
import { User } from "typeorm/user.entity";
import { TransactionDto } from "src/transaction/dto/trans.dto";
import { Transaction } from "typeorm/transaction.entity";
import crypto from "crypto";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private transRepository: Repository<Transaction>
  ) {}

  async getBalance(userId: string): Promise<number> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {wallet: true}
    });

    if (!user) {
      throw new ForbiddenException("credentials incorrect");
    }

    return user.wallet.balance;
  }

  async fund(userId: string, dto: TransactionDto): Promise<number> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new ForbiddenException("credentials incorrect");
    }
    //updating wallet
    user.wallet.balance = user.wallet.balance + dto.amount;

    //creating transaction entry
    const newTransaction = await this.transRepository.create({
      ...dto,
      id: (await crypto.randomBytes(6)).toString("hex"),
    });
    //adding new transaction to user repo
    user.transactions.push(newTransaction);

    const savedUser = await this.userRepository.save(user);

    return savedUser.wallet.balance;
  }

  async withdrawal(userId: string, dto: TransactionDto): Promise<number> {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!user) {
      throw new ForbiddenException("credentials incorrect");
    }
    const balance = user.wallet.balance - dto.amount;
    
    //checking funds
    if (balance < 0) {
        throw new ForbiddenException("insuffient funds for withdrawal");
    }
    
    //updating wallet
    user.wallet.balance = balance;

    //creating transaction entry
    const newTransaction = await this.transRepository.create({
      ...dto,
      id: (await crypto.randomBytes(6)).toString("hex"),
    });

    //adding new transaction to user repo
    user.transactions.push(newTransaction);

    const savedUser = await this.userRepository.save(user);

    return savedUser.wallet.balance;
  }

  async transfer(dto: TransferDto, userId: string) {
    //retrieving creditor details
    const creditor = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!creditor) {
      throw new ForbiddenException("credentials incorrect");
    }

    const balance = creditor.wallet.balance - dto.transaction.amount;

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
      throw new NotFoundException("User doesn't exist");
    }
    //current balance of debtor
    debtor.wallet.balance = debtor.wallet.balance + dto.transaction.amount;

    //updating debtor
    await this.userRepository.save(debtor);

    //trimming down to transaction dto
    delete dto.email;
    delete dto.note;

    //creating transaction entry
    const newTransaction = await this.transRepository.create({
      ...dto,
      id: (await crypto.randomBytes(6)).toString("hex"),
    });

    //adding new transaction to creditor
    creditor.transactions.push(newTransaction);

    const savedCreditor = await this.userRepository.save(creditor);

    return savedCreditor.wallet.balance;
  }
}
