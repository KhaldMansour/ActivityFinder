import { MinLength, IsString, IsEmail   } from 'class-validator';

export class RegisterUserDto {
    @IsString()
      firstName: string;

    @IsString()
      lastName: string;
    
    @IsEmail()
      email: string;

    @MinLength(6)
      password: string;
}