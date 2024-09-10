import { IsNotEmpty, IsString } from 'class-validator';

export class MessageChatDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
