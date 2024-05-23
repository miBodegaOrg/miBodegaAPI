import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    code: string;

    @IsNotEmpty()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    price: number;

    @IsNotEmpty()
    @Transform(({ value }) => Number(value))
    @Min(0)
    @Type(() => Number)
    stock: number;

    @IsOptional()
    category?: Array<string>;

    @IsOptional()
    image?: File;
}