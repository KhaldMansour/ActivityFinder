import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { AuthGuard } from './auth/middlewares/auth.guard';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ActivityModule } from './activity/activity.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiddlewareConsumer, NestMiddleware } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

describe('AppModule', () => {
  let appModule: TestingModule;

  beforeAll(async () => {
    appModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(appModule).toBeDefined();
  });

  // it('should have ResponseInterceptor as a global interceptor', () => {
  //   // Get the global interceptor by the token
  //   const interceptor = appModule.get<typeof APP_INTERCEPTOR>(APP_INTERCEPTOR);
  //   expect(interceptor).toBe(ResponseInterceptor);
  // }); Hemdan

  // it('should have applied AuthGuard middleware correctly', () => {
  //   // You can test if the middleware is set up by checking the configure method indirectly
  //   // This can be done by testing if the AppModule applies middleware to routes correctly
  //   const app = appModule.createNestApplication();
  //   const middleware = app.get<NestMiddleware>(AuthGuard);
  //   expect(middleware).toBeDefined();
  // }); Hemdan

  it('should import required modules', () => {
    const usersModule = appModule.get<UsersModule>(UsersModule);
    const authModule = appModule.get<AuthModule>(AuthModule);
    const activityModule = appModule.get<ActivityModule>(ActivityModule);
    
    expect(usersModule).toBeDefined();
    expect(authModule).toBeDefined();
    expect(activityModule).toBeDefined();
  });

  it('should configure TypeOrmModule correctly', () => {
    const typeOrmModule = appModule.get<TypeOrmModule>(TypeOrmModule);
    expect(typeOrmModule).toBeDefined();
  });
});
