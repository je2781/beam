
import { Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from 'typeorm/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transRepository: Repository<Transaction>,
  ) {}

  async getTransactions(userId: string): Promise<Transaction[]> {
    const trans = await this.transRepository.findBy({
        id: userId
    });

    return trans;
  }
}
