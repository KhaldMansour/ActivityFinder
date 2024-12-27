import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userExists = await this.userRepository.findOneBy({ email: createUserDto.email });
    if (userExists) {
      throw new Error('User already exists');
    }
    const user = this.userRepository.create(createUserDto);
    
    return await this.userRepository.save(user);
  }

  async findById(id: number): Promise<User> {
    return await await this.userRepository.findOneBy({ id });
  }
}
