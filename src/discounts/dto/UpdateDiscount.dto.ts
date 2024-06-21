import { ArrayNotEmpty, IsArray, IsBoolean, IsDate, IsNumber, IsOptional, IsString, Min } from "class-validator";

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
    @Min(0.001)
    value: number

    @IsBoolean()
    @IsOptional()
    active: boolean

    @IsArray()
    @ArrayNotEmpty()
    @IsOptional()
    products: string[]
}