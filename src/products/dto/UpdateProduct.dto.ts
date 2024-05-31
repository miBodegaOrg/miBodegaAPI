import { Transform, Type } from "class-transformer";
import { IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";

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
    @Min(0)
    @IsInt()
    @Type(() => Number)
    stock: number;

    @IsOptional()
    @IsString()
    category: string;

    @IsOptional()
    @IsString()
    subcategory: string;

    @IsOptional()
    image?: File;
}