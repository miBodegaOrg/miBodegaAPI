import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateDiscountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  endDate: Date;

  @Max(100)
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  percentage: number;

  @IsBoolean()
  @IsNotEmpty()
  active: boolean;

  @IsArray()
  @IsNotEmpty()
  @ArrayNotEmpty()
  products: string[];
}
