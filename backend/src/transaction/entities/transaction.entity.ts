import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from "typeorm";
import { User } from "../../user/user.entity";

@Entity()
export class Transaction {
  @PrimaryColumn()
  id: string;

  @Column()
  trans_type: string;

  @Column({ default: 0 })
  amount: number;

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: "CASCADE"})
  @JoinColumn({ name: 'userId'})
  user: User;

  @Column({ nullable: true })
  status: string;

  @Column()
  date: Date;

}
