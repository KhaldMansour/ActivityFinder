import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {

  }
  
  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto): any {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto): any {
    return this.authService.login(loginDto);
  }
}
