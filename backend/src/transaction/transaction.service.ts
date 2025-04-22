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

  async getTransactions(userId: string, currentPage: string) {
    const ITEMS_PER_PAGE = 9;
    const updatedPage = +currentPage || 1;
    try {
      const totalItems = await this.transRepository.count({
        where: {
          user: {
            id: userId,
          },
        },
        skip: (updatedPage - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
      });

      const trans = await this.transRepository.find({
        where: {
          user: {
            id: userId,
          },
        },
        skip: (updatedPage - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
      });

      const currentPage = updatedPage;
      const hasPreviousPage = currentPage > 1;
      const hasNextPage = totalItems > currentPage * ITEMS_PER_PAGE;
      const lastPage = Math.ceil(totalItems / ITEMS_PER_PAGE);

      return {
        message: "success",
        transactions: trans,
        hasNextPage,
        lastPage,
        hasPreviousPage,
        currentPage,
        isActivePage: updatedPage,
        nextPage: currentPage + 1,
        previousPage: currentPage - 1
      };
    } catch (error) {
      throw error;
    }
  }
}