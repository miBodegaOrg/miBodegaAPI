import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

export class SupplierProduct {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @IsNotEmpty()
  cost: number;

  @IsEmpty()
  _id: mongoose.Types.ObjectId;
}

export class UpdateSupplierDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  @Length(9, 9, { message: 'Phone number must be exactly 9 digits' })
  @Matches(/^\d+$/, { message: 'Phone number must consist of only digits' })
  phone: string;

  @IsString()
  @Length(11, 11, { message: 'Ruc must be exactly 11 digits' })
  @Matches(/^\d+$/, { message: 'Ruc must consist of only digits' })
  @IsOptional()
  ruc: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SupplierProduct)
  @IsOptional()
  products: SupplierProduct[];
}
