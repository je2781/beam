import { Entity, Column, OneToOne, JoinColumn} from 'typeorm';
import { AbstractEntity } from '../typeorm/abstract.entity';
import { User } from '../user/user.entity';

@Entity()
export class Bank extends AbstractEntity<Bank> {
  @Column({ nullable: true, unique: true })
  acct_no?: number;

  @Column()
  cvv: string;

  @Column() 
  card_expiry_date: string; 

  @OneToOne(() => User, (user) => user.bank)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ unique: true, length: 250,  })
  card_no: string;

}
