import { ArrayNotEmpty, IsArray, IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateDiscountDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsDate()
    @IsOptional()
    startDate: Date
    
    @IsDate()
    @IsOptional()
    endDate: Date

    @IsBoolean()
    @IsNotEmpty()
    percentage: boolean

    @IsNumber()
    @IsNotEmpty()
    @Min(0.001)
    value: number

    @IsBoolean()
    @IsNotEmpty()
    active: boolean

    @IsArray()
    @IsNotEmpty()
    @ArrayNotEmpty()
    products: string[]
}