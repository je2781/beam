import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class TransactionCounter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  counter: number;
}
