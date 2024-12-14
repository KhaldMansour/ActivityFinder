import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiResponseDto } from 'src/dto/api-response.dto';
  
  @Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponseDto<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponseDto<T>> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode || HttpStatus.OK;
        const isSuccess = statusCode >= 200 && statusCode < 300;
        return {
          statusCode,
          message: isSuccess ? 'Request was successful' : 'An error occurred',
          data: isSuccess ? data : null,
          error: !isSuccess ? data?.message || 'An error occurred' : null
        };
      })
    );
  }
}
  