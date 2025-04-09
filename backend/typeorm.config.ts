import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Wallet } from './src/wallet/wallet.entity';
import { Transaction } from './src/transaction/transaction.entity';
import { User } from './src/user/user.entity';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'mysql',
  host: configService.getOrThrow('DB_HOST'),
  port: configService.getOrThrow('DB_PORT'),
  database: configService.getOrThrow('DB_NAME'),
  username: configService.getOrThrow('DB_USER'),
  password: configService.getOrThrow('DB_PASS'),
  migrations: ['migrations/**'],
  migrationsTableName: 'migrations',
  entities: [User, Transaction, Wallet],
});