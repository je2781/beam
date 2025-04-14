import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { DataSource } from 'typeorm';
import { Wallet } from './src/wallet/wallet.entity';
import { Transaction } from './src/transaction/entities/transaction.entity';
import { User } from './src/user/user.entity';
import { Bank } from './src/bank/bank.entity';
import { TransactionCounter } from './src/transaction/entities/transaction-counter.entity';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port:Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  logging: false,
  extra: {
    connectionLimit: 10
  },
  migrations: ['migrations_test/**'],
  migrationsTableName: 'migrations_test',
  synchronize:  false,
  entities: [User, Transaction, Wallet, Bank, TransactionCounter],
});

export default AppDataSource;