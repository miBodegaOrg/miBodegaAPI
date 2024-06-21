import { ArrayNotEmpty, IsArray, IsBoolean, IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateDiscountDto {
    
    @IsString()
    @IsOptional()
    name: string;

    @IsDate()
    @IsOptional()
    startDate: Date
    
    @IsDate()
    @IsOptional()
    endDate: Date

    @IsBoolean()
    @IsOptional()
    percentage: boolean

    @IsNumber()
    @IsOptional()
    value: number

    @IsBoolean()
    @IsOptional()
    active: boolean

    @IsArray()
    @ArrayNotEmpty()
    @IsOptional()
    products: string[]
}