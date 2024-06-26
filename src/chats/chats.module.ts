import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from 'src/schemas/Chat.schema';
import { Product, ProductSchema } from 'src/schemas/Product.schema';
import { Sale, SaleSchema } from 'src/schemas/Sales.schema';
import { Promotion, PromotionSchema } from 'src/schemas/Promotion.schema';
import { Discount, DiscountSchema } from 'src/schemas/Discount.schema';
import { Purchase, PurchaseSchema } from 'src/schemas/Purchase.schema';
import { Supplier, SupplierSchema } from 'src/schemas/Supplier.schema';

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
      },
      {
        name: Promotion.name,
        schema: PromotionSchema,
      },
      {
        name: Discount.name,
        schema: DiscountSchema,
      },
      {
        name: Purchase.name,
        schema: PurchaseSchema,
      },
      {
        name: Supplier.name,
        schema: SupplierSchema,
      }
    ])
  ],
  controllers: [ChatsController],
  providers: [ChatsService]
})
export class ChatsModule {}
