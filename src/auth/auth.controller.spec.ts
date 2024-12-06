import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker/.';
import * as bcrypt from 'bcryptjs';

import { User } from 'src/users/entities/user.entity';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService
        }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register and return a user', async () => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const hashedPassword = await  bcrypt.hash('password', 10);
      const email = faker.internet.email();
      const registerUserDto: RegisterUserDto = { email, password : hashedPassword , firstName , lastName };
      const result: Partial<User> = { id: 1, email, password: hashedPassword , firstName , lastName , isAdmin: false};
      mockAuthService.register.mockResolvedValue(result);

      const response = await controller.register(registerUserDto);

      expect(service.register).toHaveBeenCalledWith(registerUserDto);
      expect(response).toEqual(result);
    });
  });

  describe('login', () => {
    it('should call authService.login and return an access token', async () => {
      const loginDto: LoginDto = { email: faker.string.alphanumeric(15) ,password: 'password' };
      const accessToken = { access_token: faker.string.alphanumeric(15) };
      mockAuthService.login.mockResolvedValue(accessToken);

      const response = await controller.login(loginDto);

      expect(service.login).toHaveBeenCalledWith(loginDto);
      expect(response).toEqual(accessToken);
    });
  });
});
