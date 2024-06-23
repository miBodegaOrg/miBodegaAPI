import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateEmployeeDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    lastname: string;

    @IsEmail()
    @IsOptional()
    email: string;

    @IsString()
    @IsNotEmpty()
    dni: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}