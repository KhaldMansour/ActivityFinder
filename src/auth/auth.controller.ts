import { Body, Controller, Post } from '@nestjs/common';

import { User } from 'src/users/entities/user.entity';

import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {

  }
  
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise <User> {
    return await this.authService.register(registerUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    return this.authService.login(loginDto);
  }
}
