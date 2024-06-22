import { ArrayNotEmpty, IsArray, IsBoolean, IsDate, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class UpdatePromotionDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    startDate: Date;

    @IsOptional()
    endDate: Date;

    @IsOptional()
    @IsNumber()
    @IsInt()
    @Min(2)
    buy: number;

    @IsOptional()
    @IsNumber()
    @IsInt()
    @Min(2)
    pay: number;

    @IsOptional()
    @IsBoolean()
    active: boolean;

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    products: string[];
}
