
import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { AbstractEntity } from '../typeorm/abstract.entity';

@Entity()
export class Wallet extends AbstractEntity<Wallet> {
 @Column({default: 0})
  balance: number;

  @OneToOne(() => User, (user) => user.wallet, { onDelete: 'CASCADE' , cascade: true})
  @JoinColumn() 
  user: User;
}
