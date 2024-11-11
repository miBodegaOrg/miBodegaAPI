import { forwardRef, Module } from "@nestjs/common";
import { DiscountsController } from './discounts.controller';
import { DiscountsService } from './discounts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Discount, DiscountSchema } from 'src/schemas/Discount.schema';
import { Product, ProductSchema } from 'src/schemas/Product.schema';
import { AuthModule } from 'src/auth/auth.module';
import { PromotionsModule } from "../promotions/promotions.module";
import { PromotionsService } from "../promotions/promotions.service";

@Module({
  imports: [
    AuthModule,
    PromotionsModule,
    MongooseModule.forFeature([
      { name: Discount.name, schema: DiscountSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [DiscountsController],
  providers: [DiscountsService],
  exports: [DiscountsService],
})
export class DiscountsModule {}
