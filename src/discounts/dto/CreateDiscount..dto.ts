import { ArrayNotEmpty, IsArray, IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

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

    @Max(100)
    @Min(0)
    @IsNumber()
    @IsNotEmpty()
    percentage: number

    @IsBoolean()
    @IsNotEmpty()
    active: boolean

    @IsArray()
    @IsNotEmpty()
    @ArrayNotEmpty()
    products: string[]
}