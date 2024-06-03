import { Module } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { Sale, SaleSchema } from 'src/schemas/Sales.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Product, ProductSchema } from 'src/schemas/Product.schema';

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
    ]),
    AuthModule
  ],
  controllers: [SalesController],
  providers: [SalesService]
})
export class SalesModule {
  constructor(private salesService: SalesService) {}
}
