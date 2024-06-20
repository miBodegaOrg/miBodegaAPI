import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateEmployeeDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    lastname: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    dni: string;

    @IsString()
    @IsOptional()
    phone: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}