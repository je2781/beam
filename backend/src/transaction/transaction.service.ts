
import { Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from 'src/transaction/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transRepository: Repository<Transaction>,
  ) {}

  async getTransactions(userId: string){
    const trans = await this.transRepository.findBy({
        id: userId
    });

    return {
      message: 'success',
      ...trans
    };
  }
}
