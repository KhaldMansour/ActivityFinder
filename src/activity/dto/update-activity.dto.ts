import {
  ApiProperty
} from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsString,
  Max,
  Min,
  MinLength
} from 'class-validator';
  
export class UpdateActivityDto {
    @ApiProperty({
      description: 'The title of the activity',
      example: 'Rock Climbing',
      minLength: 6
    })
    @IsString()
    @MinLength(6)
      title?: string;
  
    @ApiProperty({
      description: 'The price of the activity',
      example: 50
    })
    @IsNumber()
      price?: number;
  
    @ApiProperty({
      description: 'The rating of the activity (0 to 5)',
      example: 4,
      minimum: 0,
      maximum: 5
    })
    @IsNumber()
    @Min(0, { message: 'The value must be at least 0' })
    @Max(5, { message: 'The value must not exceed 5' })
      rating?: number;
  
    @ApiProperty({
      description: 'Indicates if the activity has an offer',
      example: true,
      required: false
    })
    @IsBoolean()
      hasOffer?: boolean;
}
  