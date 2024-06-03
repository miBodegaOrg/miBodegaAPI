import { Transform, Type } from "class-transformer";
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    code: string;

    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    price: number;

    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(0.001)
    stock: number;

    @IsOptional()
    @IsString()
    category: string;

    @IsOptional()
    @IsString()
    subcategory: string;

    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
          return value.toLowerCase() === 'true';
        }
        return Boolean(value);
      })
    @IsBoolean()
    weight: boolean;

    @IsOptional()
    image?: File;
}