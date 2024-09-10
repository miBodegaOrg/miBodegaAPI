import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
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

  @IsNotEmpty()
  @IsNumber()
  cost: number;

  @IsEmpty()
  _id: mongoose.Types.ObjectId;
}

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(9, 9, { message: 'Phone number must be exactly 9 digits' })
  @Matches(/^\d+$/, { message: 'Phone number must consist of only digits' })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 11, { message: 'Ruc must be exactly 11 digits' })
  @Matches(/^\d+$/, { message: 'Ruc must consist of only digits' })
  ruc: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SupplierProduct)
  @IsNotEmpty()
  products: SupplierProduct[];
}
