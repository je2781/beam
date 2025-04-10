import { Entity, Column, OneToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Wallet } from '../wallet/wallet.entity';
import { Transaction } from '../transaction/transaction.entity';
import { AbstractEntity } from '../typeorm/abstract.entity';

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

  @OneToMany(() => Transaction, (transaction) => transaction.user, { cascade: true })
  transactions: Transaction[];

  @Column({ nullable: true })
  bank: string;

  @Column({ nullable: true })
  acct_no: string;
}
