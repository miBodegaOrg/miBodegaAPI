import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from 'src/schemas/Chat.schema';
import { Product, ProductSchema } from 'src/schemas/Product.schema';
import { Sale, SaleSchema } from 'src/schemas/Sales.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Chat.name,
        schema: ChatSchema,
      },
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: Sale.name,
        schema: SaleSchema,
      }
    ])
  ],
  controllers: [ChatsController],
  providers: [ChatsService]
})
export class ChatsModule {}
