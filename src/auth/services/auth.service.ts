import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';

import { User } from 'src/users/entities/user.entity';

import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const user = this.userRepository.create(registerUserDto);
    return plainToInstance(User, await this.userRepository.save(user));
  }

  async login(data: LoginDto): Promise<{ access_token: string }> {
    const user = await this.userRepository.findOneBy({ email: data.email });
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const passwordMatches = await bcrypt.compare(data.password, user.password);
    
    if (!passwordMatches) {     
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const payload = { userId: user.id, email: user.email };
    
    return {
      access_token: await this.jwtService.signAsync(payload)
    };
  }

  async validateToken(token: string): Promise<JwtPayload> {
    return await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET')
    });
  }
}
