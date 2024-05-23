import { IsArray, IsNotEmpty } from "class-validator";

interface Product {
    code: string;
    quantity: number;
}

export class CreateSaleDto {
    @IsArray()
    @IsNotEmpty()
    products: Product[];
}