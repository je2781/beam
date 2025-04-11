import { Entity, Column, OneToOne} from 'typeorm';
import { AbstractEntity } from '../typeorm/abstract.entity';
import { User } from './user.entity';

@Entity()
export class Bank extends AbstractEntity<Bank> {
  @Column({ unique: true })
  acct_no?: number;

  @Column()
  cvv: number;

  @Column() 
  card_expiry_date: string; 

  @OneToOne(() => User, (user) => user.bank)
  user: User;

  @Column({ unique: true })
  card_no: number;

}
