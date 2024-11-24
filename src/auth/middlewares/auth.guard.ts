import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService
  ) {}
  async use(request: Request, res: Response, next: NextFunction): Promise <void> {
    try {
      const { authorization }: any = request.headers;
      if (!authorization || authorization.trim() === '') {
        throw new UnauthorizedException('Please provide token');
      }
      const authToken = authorization.replace(/bearer/gim, '').trim();
      const resp = await this.authService.validateToken(authToken);
      const user: User = await this.userService.findById(resp.userId);
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      request['user'] = user;

      return next();
    } catch (error) {
      console.log('auth error - ', error.message);
      throw new ForbiddenException(
        error.message || 'session expired! Please sign In'
      );
    }
  }
}
