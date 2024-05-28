import { Type } from "class-transformer";
import { IsArray, IsEmpty, IsInt, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from "class-validator";

export class Product {
    @IsString()
    @IsNotEmpty()
    code: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @IsInt()
    quantity: number;

    @IsEmpty()
    name: string;

    @IsEmpty()
    price: number;
}

export class CreateSaleDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Product)
    @IsNotEmpty()
    products: Product[]
}