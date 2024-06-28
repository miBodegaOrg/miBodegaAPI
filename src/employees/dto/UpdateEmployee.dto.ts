import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateEmployeeDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    lastname: string;

    @IsEmail()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    dni: string;

    @IsString()
    @IsOptional()
    phone: string;

    @IsString()
    @IsOptional()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsArray()
    permissions: string[];
}