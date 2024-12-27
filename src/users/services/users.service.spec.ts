import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker/.';

import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository // Use the mocked repository
        }
      ]
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user if email is not taken', async () => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const hashedPassword = faker.internet.password();
      const email = faker.internet.email();
      const createUserDto: CreateUserDto = { email, password : hashedPassword , firstName , lastName };
      const savedUser = { ...createUserDto, id: 1 };
      mockUserRepository.findOneBy.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(savedUser);
      mockUserRepository.save.mockResolvedValue(savedUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(savedUser);
      expect(userRepository.save).toHaveBeenCalledWith(savedUser);
    });

    it('should throw an error if the user already exists', async () => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const hashedPassword = faker.internet.password();
      const email = faker.internet.email();
      const createUserDto: CreateUserDto = { email, password: hashedPassword, firstName, lastName };
      const existingUser = { id: 1, email, password: hashedPassword, firstName, lastName };
      mockUserRepository.findOneBy.mockResolvedValue({ existingUser});
    
      await expect(service.create(createUserDto)).rejects.toThrowError('User already exists');
        
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a user when a valid ID is provided', async () => {
      const userId = 1;
      const user = { id: userId, email: 'test@example.com', firstName: 'John', lastName: 'Doe' };      
      mockUserRepository.findOneBy.mockResolvedValue(user);

      const result = await service.findById(userId);

      expect(result).toEqual(user);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
    });

    it('should return null if no user is found for the given ID', async () => {
      const userId = 1;
      mockUserRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findById(userId);

      expect(result).toBeNull();
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
    });
  });
});
