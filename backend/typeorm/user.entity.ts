
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany } from 'typeorm';
import { Wallet } from './wallet.entity';
import { Transaction } from './transaction.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ length: 500 })
  full_name: string;

  @Column('text')
  email: string;

  @Column('text')
  hash?: string;

  @OneToOne(() => Wallet, (wallet) => wallet.user, {cascade: true})
  wallet: Wallet;

  @OneToMany(() => Transaction, (transaction) => transaction.user, {cascade: true})
  transactions: Transaction[];

  @Column('text')
  bank: string;

  @Column('text')
  acct_no: string;
}
