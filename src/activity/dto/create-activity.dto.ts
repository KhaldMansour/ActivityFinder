import { IsBoolean, IsNumber, IsString, Max, Min, MinLength } from 'class-validator';

export class CreateActivityDto {
    @IsString()
    @MinLength(6)
      title: string;

    @IsNumber()
      price: number;

    @IsNumber()
    @Min(0, { message: 'The value must be at least 0' })
    @Max(5, { message: 'The value must not exceed 5' })
      rating: number;

    @IsBoolean()
      hasOffer?: boolean;
}
