import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { AuthModule } from 'src/auth/auth.module';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from 'src/schemas/Chat.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Chat.name,
        schema: ChatSchema,
      }
    ])
  ],
  controllers: [ChatsController],
  providers: [ChatsService]
})
export class ChatsModule {}
