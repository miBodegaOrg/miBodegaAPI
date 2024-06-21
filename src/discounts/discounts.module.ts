import { Module } from '@nestjs/common';
import { DiscountsController } from './discounts.controller';
import { DiscountsService } from './discounts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Discount, DiscountSchema } from 'src/schemas/Discount.schema';
import { Product, ProductSchema } from 'src/schemas/Product.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Discount.name, schema: DiscountSchema },
      { name: Product.name, schema: ProductSchema }
    ])
  ],
  controllers: [DiscountsController],
  providers: [DiscountsService]
})
export class DiscountsModule {}
