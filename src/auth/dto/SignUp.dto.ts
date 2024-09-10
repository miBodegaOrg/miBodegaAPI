import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

export class SignUpDto {
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

  @IsString()
  @IsNotEmpty()
  @Length(11, 11, { message: 'Ruc must be exactly 11 digits' })
  @Matches(/^\d+$/, { message: 'Ruc must consist of only digits' })
  ruc: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
