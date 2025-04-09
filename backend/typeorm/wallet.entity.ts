
import { Entity, Column, PrimaryGeneratedColumn, Timestamp, ManyToOne, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Wallet {
  @PrimaryColumn({length: 36})
  id: string;

  @Column({default: 0})
  balance: number;

  @OneToOne(() => User, (user) => user.wallet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) 
  user: User;
}
