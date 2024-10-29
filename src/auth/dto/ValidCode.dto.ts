import { IsNotEmpty, IsString } from 'class-validator';

export class ValidCodeDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}
