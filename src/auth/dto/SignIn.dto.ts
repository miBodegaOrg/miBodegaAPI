import { IsNotEmpty, IsString } from "class-validator"

export class SignInDto{
    @IsString()
    @IsNotEmpty()
    ruc: string

    @IsString()
    @IsNotEmpty()
    password: string
}