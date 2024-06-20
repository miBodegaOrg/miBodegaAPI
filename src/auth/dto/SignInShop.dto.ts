import { IsNotEmpty, IsString } from "class-validator"

export class SignInShopDto{
    @IsString()
    @IsNotEmpty()
    ruc: string

    @IsString()
    @IsNotEmpty()
    password: string
}