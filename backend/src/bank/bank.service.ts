import { Injectable } from '@nestjs/common';
import { UpdateBankDto } from './dto/update-bank.dto';
import { Repository } from 'typeorm';
import { Bank } from './bank.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(Bank)
    private bankRepository: Repository<Bank>
  ){
    
  }

  findAll() {
    return `This action returns all bank`;
  }

  async findOne(userId: string) {
    try {
      const currentUserBank = await this.bankRepository.findOne({
        where: {
          user: {
            id: userId
          }
        }
      });
  
      return currentUserBank ?? {
        cvv: '',
        card_expiry_date: '',
        card_no: '',
        acct_no: ''
      };
    } catch (error) {
      throw error;
    }
  }

  update(id: number, updateBankDto: UpdateBankDto) {
    return `This action updates a #${id} bank`;
  }

  remove(id: number) {
    return `This action removes a #${id} bank`;
  }
}
