import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule  } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './config/typeorm.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true // hemdan
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    UsersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(AuthGuard)
  //     .exclude(
  //       { path: 'api/auth/login', method: RequestMethod.POST },
  //       { path: 'api/auth/register', method: RequestMethod.POST }
  //     )
  //     .forRoutes('*')
  //     ;
  // }
}
