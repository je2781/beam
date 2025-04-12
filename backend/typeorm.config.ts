import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import { DataSource } from 'typeorm';
import { Wallet } from './src/wallet/wallet.entity';
import { Transaction } from './src/transaction/entities/transaction.entity';
import { User } from './src/user/user.entity';
import { Bank } from './src/bank/bank.entity';
import { TransactionCounter } from './src/transaction/entities/transaction-counter.entity';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.NODE_ENV === 'development' ? Number(process.env.DB_PORT) : Number(process.env.DB_TEST_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  migrations: ['migrations/**'],
  migrationsTableName: 'migrations',
  entities: [User, Transaction, Wallet, Bank, TransactionCounter],
});

export default AppDataSource;
