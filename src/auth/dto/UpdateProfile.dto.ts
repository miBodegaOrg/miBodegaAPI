import { IsNotEmpty, IsString, Length, Matches, MinLength } from "class-validator";

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  @Length(9, 9, { message: 'Phone number must be exactly 9 digits' })
  @Matches(/^\d+$/, { message: 'Phone number must consist of only digits' })
  phone: string;
}