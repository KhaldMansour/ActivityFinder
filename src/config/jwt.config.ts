import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const JWTConfig = async (
  configService: ConfigService
): Promise<JwtModuleOptions> => ({
  secret: configService.get<string>('JWT_SECRET'),
  signOptions: {
    expiresIn: configService.get<string>('JWT_EXPIRES_IN')
  }
});
