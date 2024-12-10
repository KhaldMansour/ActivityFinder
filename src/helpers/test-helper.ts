import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { AuthService } from 'src/auth/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { JWTConfig } from 'src/config/jwt.config';
import { UsersModule } from 'src/users/users.module';

import * as dotenv from 'dotenv'; // Import dotenv

// Load environment variables from .env file
dotenv.config();


export async function createTestingModule(
  imports: any[],
  controller: any,
  providers: any[] = [],
  entities: any[] = []
): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot(),
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true
      }),
      JwtModule.register({
        secretOrPrivateKey: 'process.env.JWT_SECRET',
        secret: 'process.env.JWT_SECRET',
        signOptions: { expiresIn: '1h' },
      }),
      forwardRef(() => UsersModule),
      
      AppModule,
      TypeOrmModule.forFeature(entities),
      ...imports
    ],
    controllers: [controller],
    providers : [AuthService, ...providers]
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  return app;
}
