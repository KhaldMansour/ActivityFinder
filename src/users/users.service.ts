import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

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

  // findAll() {
  //   return 'This action returns all users';
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }

  async findById(id: number): Promise<User> {
    return await await this.userRepository.findOneBy({ id });
  }
}
