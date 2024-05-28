import { IsArray, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class ProductInterface {
    @IsString()
    @IsNotEmpty()
    code: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    quantity: number;
}

export class CreateSaleDto {
    @IsArray()
    @IsNotEmpty()
    products: ProductInterface[];
}