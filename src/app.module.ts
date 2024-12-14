import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './config/typeorm.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/middlewares/auth.guard';
import { ActivityModule } from './activity/activity.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true // hemdan
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    UsersModule,
    AuthModule,
    ActivityModule
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    }
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthGuard)
      .exclude(
        { path: '/auth/login', method: RequestMethod.POST },
        { path: '/auth/register', method: RequestMethod.POST }
      )
      .forRoutes('*');
  }
}
