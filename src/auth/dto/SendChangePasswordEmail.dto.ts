import { IsNotEmpty, IsString } from 'class-validator';

export class SendChangePasswordEmailDto {
  @IsString()
  @IsNotEmpty()
  email: string;
}
