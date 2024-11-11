import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

ConfigModule.forRoot(); // Hemdan
const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'), 
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  synchronize: false,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'], 
  migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
  subscribers: ['src/subscriber/**/*{.ts,.js}']
});