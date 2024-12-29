import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors
} from '@nestjs/common';

import { User } from 'src/users/entities/user.entity';

import { AuthService } from '../services/auth.service';
import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginDto } from '../dto/login.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiResponse
} from '@nestjs/swagger';
import { ApiResponseDto } from 'src/dto/api-response.dto';
import { ResponseInterceptor } from 'src/interceptors/response.interceptor';
import { first } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: 201,
    description: 'Successfully logged in',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 201 },
        message: { type: 'string', example: 'Request was successful' },
        data: {
          type: 'object',
          example: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'user@example.com',
          }
        },
        error: { type: 'string', nullable: true }
      }
    }
  })
  async register(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    return await this.authService.register(registerUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Request was successful' },
        data: {
          type: 'object',
          properties: {
            access_token: { type: 'string', example: 'some-jwt-token' }
          }
        },
        error: { type: 'string', nullable: true }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'An error occurred' })
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    return await this.authService.login(loginDto);
  }
}
