import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class ProductItem {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0.001)
  quantity: number;

  @IsEmpty()
  name: string;

  @IsEmpty()
  price: number;

  @IsEmpty()
  discount: number;

  @IsEmpty()
  cost: number;

  @IsEmpty()
  rentability: number;
}

export class CreateSaleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductItem)
  @ArrayNotEmpty()
  @IsNotEmpty()
  products: ProductItem[];
}
