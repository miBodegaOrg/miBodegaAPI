import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Sale, SaleSchema } from '../schemas/Sales.schema';
import { Product, ProductSchema } from '../schemas/Product.schema';
import { Discount, DiscountSchema } from '../schemas/Discount.schema';
import { Promotion, PromotionSchema } from '../schemas/Promotion.schema';
import { AuthModule } from '../auth/auth.module';
import { Chat, ChatSchema } from '../schemas/Chat.schema';
import { Employee, EmployeeSchema } from '../schemas/Employee.schema';
import { Purchase, PurchaseSchema } from '../schemas/Purchase.schema';
import { Supplier, SupplierSchema } from '../schemas/Supplier.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Sale.name,
        schema: SaleSchema,
      },
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: Discount.name,
        schema: DiscountSchema,
      },
      {
        name: Promotion.name,
        schema: PromotionSchema,
      },
      {
        name: Chat.name,
        schema: ChatSchema,
      },
      {
        name: Employee.name,
        schema: EmployeeSchema,
      },
      {
        name: Purchase.name,
        schema: PurchaseSchema,
      },
      {
        name: Supplier.name,
        schema: SupplierSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
