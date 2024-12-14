import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { faker } from '@faker-js/faker/.';
import { Repository } from 'typeorm';
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { User } from 'src/users/entities/user.entity'; 
import { Activity } from 'src/activity/entities/activity.entity';

import { AuthModule } from '../auth.module';
import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginDto } from '../dto/login.dto';

dotenv.config({ path: './.env.test' });

describe('AuthController (integration)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User , Activity],
          synchronize: true
        }),
        AuthModule,
        ConfigModule.forRoot({ isGlobal: true })
      ]
    }).compile();
  
    app = moduleFixture.createNestApplication();
  
    await app.init();
    userRepository = app.get('UserRepository');
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a user and return a user object', async () => {
    const email = faker.internet.email();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const password = faker.internet.password();
    const registerDto: RegisterUserDto = {
      email,
      password,
      firstName,
      lastName
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto);    
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe(email);
    expect(response.body.firstName).toBe(firstName);
    expect(response.body.lastName).toBe(lastName);
    expect(response.body).not.toHaveProperty('password');
  });

  it('should login a user and return an access token', async () => {
    const email = faker.internet.email();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const password = faker.internet.password();
    const validUser: RegisterUserDto = {
      email,
      password,
      firstName,
      lastName
    };
    const user = userRepository.create(validUser);
    await userRepository.save(user);
    const loginDto: LoginDto = {
      email,
      password
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('access_token');
  });
});
