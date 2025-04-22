import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transaction } from "./entities/transaction.entity";

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transRepository: Repository<Transaction>
  ) {}

  async getTransactions(userId: string) {
    try {
      const trans = await this.transRepository.find({
        where: {
          user: {
            id: userId,
          },
        }
      });


      return {
        message: "success",
        transactions: trans

      };
    } catch (error) {
      throw error;
    }
  }
}
