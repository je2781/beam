
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Wallet } from './wallet.entity';
import { Transaction } from './transaction.entity';

@Entity()
export class User {
  @PrimaryColumn({length: 36})
  id: string;

  @Column({ length: 500 })
  full_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  hash?: string;

  @OneToOne(() => Wallet, (wallet) => wallet.user, {cascade: true})
  wallet: Wallet;

  @OneToMany(() => Transaction, (transaction) => transaction.user, {cascade: true})
  transactions: Transaction[];

  @Column({default: 'bank'})
  bank: string;

  @Column({default: 'acct'})
  acct_no: string;
}
