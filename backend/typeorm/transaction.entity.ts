
import { Entity, Column, PrimaryGeneratedColumn, Timestamp, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Transaction {
  @PrimaryColumn({length: 36})
  id: string;

  @Column({ length: 500 })
  trans_type: string;

  @Column({default: 0})
  amount: number;

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) 
  user: User;

  @Column({default: ''})
  status: string;

  @Column({ type: 'timestamp' })
  date: Date;
}
