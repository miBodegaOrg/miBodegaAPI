import { IsNotEmpty, IsString } from "class-validator";

export class SignInEmployeeDto {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}