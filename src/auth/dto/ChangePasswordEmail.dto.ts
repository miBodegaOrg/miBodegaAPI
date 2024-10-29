import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordEmailDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}
