import { forwardRef, Module } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Promotion, PromotionSchema } from 'src/schemas/Promotion.schema';
import { Product, ProductSchema } from 'src/schemas/Product.schema';
import { DiscountsModule } from '../discounts/discounts.module';

@Module({
  imports: [
    AuthModule,
    forwardRef(() => DiscountsModule),
    MongooseModule.forFeature([
      {
        name: Promotion.name,
        schema: PromotionSchema,
      },
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
  ],
  controllers: [PromotionsController],
  providers: [PromotionsService],
  exports: [PromotionsService],
})
export class PromotionsModule {}
