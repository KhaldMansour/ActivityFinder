import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { faker } from '@faker-js/faker/.';

import { User } from 'src/users/entities/user.entity';

import { LoginDto } from '../dto/login.dto';
import { RegisterUserDto } from '../dto/register-user.dto';

import { AuthService } from './auth.service';

const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn()
};

const mockJwtService = {
  signAsync: jest.fn(),
  verifyAsync: jest.fn()
};

const mockConfigService = {
  get: jest.fn()
};

jest.mock('@nestjs/jwt');

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService:  JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService }
      ]
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const password = faker.internet.password();
      const email = faker.internet.email();
      const registerUserDto: RegisterUserDto = { email, password, firstName, lastName};
      const mockUser = { id: 1, ...registerUserDto};
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      const expectedUser: User = plainToInstance(User, mockUser);

      const result = await authService.register(registerUserDto);

      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(registerUserDto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('login', () => {
    it('should return an access token when credentials are valid', async () => {
      const password = faker.internet.password();
      const email = faker.internet.email();
      const loginDto: LoginDto = { email, password };
      const mockUser = { id: 1, email, password: 'hashedPassword' };
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(
        (password: string, hash: string) => {
          return Promise.resolve(true);
        }
      );
      const mockJwtToken = faker.string.alphanumeric(15);
      mockJwtService.signAsync.mockResolvedValue(mockJwtToken);

      const result = await authService.login(loginDto);

      expect(result.access_token).toBe(mockJwtToken);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ email: loginDto.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({ userId: mockUser.id, email: mockUser.email });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const password = faker.internet.password();
      const email = faker.internet.email();
      const loginDto: LoginDto = { email, password };
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrowError(UnauthorizedException);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ email: loginDto.email });
    });

    it('should throw UnauthorizedException if passwords do not match', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrongpassword' };
      const mockUser = { id: 1, email: 'test@example.com', password: 'hashedPassword' };
      jest.spyOn(bcrypt, 'compare').mockImplementation(
        (password: string, hash: string) => {
          return Promise.resolve(false);
        }
      );
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);

      await expect(authService.login(loginDto)).rejects.toThrowError(UnauthorizedException);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ email: loginDto.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
    });
  });

  describe('validateToken', () => {
    it('should return the decoded payload when token is valid', async () => {
      const token = 'valid_token';
      const decodedPayload = { userId: 1, email: 'test@example.com' };
      mockJwtService.verifyAsync.mockResolvedValue(decodedPayload);
      mockConfigService.get.mockReturnValue('secret');

      const result = await authService.validateToken(token);

      expect(result).toEqual(decodedPayload);
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(token, { secret: 'secret' });
    });

    it('should throw an error when token is invalid', async () => {
      const token = 'invalid_token';
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));
      mockConfigService.get.mockReturnValue('secret');

      await expect(authService.validateToken(token)).rejects.toThrowError('Invalid token');

      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(token, { secret: 'secret' });
    });
  });
});
