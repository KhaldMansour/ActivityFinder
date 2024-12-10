import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity'; // Import User entity
import * as request from 'supertest';
import { createTestingModule } from 'src/helpers/test-helper';
import { INestApplication } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { faker } from '@faker-js/faker/.';
import { Repository } from 'typeorm';

import * as dotenv from 'dotenv';
dotenv.config({ path: './.env.test' });

describe('AuthController (integration)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    app = await createTestingModule([], AuthController, [AuthService,
      ConfigService,
      JwtService,] , [User]);
      userRepository = app.get('UserRepository');
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a user and return a user object', async () => {
    const email = faker.internet.email();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const registerDto: RegisterUserDto = {
      email,
      password: 'password123',
      firstName,
      lastName,
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto)
      .expect(201);

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
      lastName,
    };
    const user = userRepository.create(validUser);
    const createdUser = await userRepository.save(user);

    const loginDto: LoginDto = {
      email,
      password
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)

      // console.log('JWT_SECRET:', process.env.JWT_SECRET); 


    expect(response.body).toHaveProperty('access_token');
  });
});
