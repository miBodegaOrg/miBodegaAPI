import { ArrayNotEmpty, IsArray, IsBoolean, IsDate, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

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

    @Max(100)
    @Min(0)
    @IsNumber()
    @IsOptional()
    percentage: number

    @IsBoolean()
    @IsOptional()
    active: boolean

    @IsArray()
    @ArrayNotEmpty()
    @IsOptional()
    products: string[]
}