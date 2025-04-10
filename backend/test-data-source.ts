// test/test-data-source.ts
import { DataSource } from 'typeorm';
import { Wallet } from './src/wallet/wallet.entity';
import { Transaction } from './src/transaction/transaction.entity';
import { User } from './src/user/user.entity';

export const testDataSource = new DataSource({
  type: 'mysql',
  host: 'test-db',
  port: 3308,
  username: 'test_user',
  password: 'test_pass',
  database: 'myapp_test',
  connectTimeout: 30000,
  migrations: ['migrations/**'],
  migrationsTableName: 'migrations',
  entities: [User, Transaction, Wallet],
});
