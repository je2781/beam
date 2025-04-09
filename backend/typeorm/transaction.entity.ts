
import { Entity, Column, PrimaryGeneratedColumn, Timestamp, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ length: 500 })
  trans_type: string;

  @Column('int')
  amount: number;

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) 
  user: User;

  @Column('text')
  status: string;

  @Column({ type: 'timestamp' })
  date: Date;
}
