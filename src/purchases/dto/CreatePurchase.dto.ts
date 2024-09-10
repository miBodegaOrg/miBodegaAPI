import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MIN,
  Min,
  ValidateNested,
} from 'class-validator';

export class PurchaseProduct {
  @IsNotEmpty()
  @IsNumber()
  @Min(0.001)
  quantity: number;

  @IsString()
  @IsNotEmpty()
  code: string;
}

export class CreatePurchaseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseProduct)
  @IsNotEmpty()
  @ArrayNotEmpty()
  products: PurchaseProduct[];

  @IsString()
  @IsNotEmpty()
  ruc: string;

  @IsNumber()
  @IsOptional()
  @Min(0.01)
  discount: number;

  @IsNumber()
  @IsOptional()
  @Min(0.01)
  shipping: number;
}
