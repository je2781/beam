
import { Entity, Column, PrimaryGeneratedColumn, Timestamp, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { AbstractEntity } from '../typeorm/abstract.entity';

@Entity()
export class Transaction extends AbstractEntity<Transaction> {
  @Column()
  trans_type: string;

  @Column({default: 0})
  amount: number;

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
  @JoinColumn() 
  user: User;

  @Column({nullable: true})
  status: string;

  @Column()
  date: Date;

  // Extra properties can be defined as methods or getter properties
  get email(): string {
    return `${this.email}`;
  }

  get note(): string {
    return `${this.note}`;
  }
}
