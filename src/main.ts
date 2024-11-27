import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1/');

  const configService = app.get(ConfigService);
  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.get<string>('APP_NAME') ?? 'Activity Finder')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: 'Please enter token in following format: <Token>',
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(3000);
}
bootstrap();
