import { Type } from "class-transformer";
import { IsArray, IsEmpty, IsInt, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from "class-validator";

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
}

export class CreateSaleDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductItem)
    @IsNotEmpty()
    products: ProductItem[]
}