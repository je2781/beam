import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { Transaction } from '../transaction/entities/transaction.entity';
import { AbstractEntity } from '../typeorm/abstract.entity';
import { Bank } from '../bank/bank.entity';
import { Wallet } from '../wallet/wallet.entity';

@Entity()
export class User extends AbstractEntity<User> {
  @Column()
  full_name?: string;

  @Column({ unique: true}) // Make email unique
  email: string;

  @Column() // Ensure this is nullable
  hash: string; // Store hashed password, so no `?`

  @OneToOne(() => Wallet, (wallet) => wallet.user, { cascade: true })
  wallet: Wallet;

  @OneToOne(() => Bank, (bank) => bank.user, { cascade: true })
  bank?: Bank;

  @OneToMany(() => Transaction, (transaction) => transaction.user, { cascade: true })
  transactions: Transaction[];

}
