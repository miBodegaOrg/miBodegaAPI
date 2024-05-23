import { Transform, Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";

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
    @Type(() => Number)
    stock: number;

    @IsOptional()
    category?: Array<string>;

    @IsOptional()
    image?: File;
}