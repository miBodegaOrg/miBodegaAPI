import { Module } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { Sale, SaleSchema } from 'src/schemas/Sales.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from 'src/products/products.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Sale.name,
        schema: SaleSchema,
      },
    ]),
    ProductsModule,
    AuthModule
  ],
  controllers: [SalesController],
  providers: [SalesService]
})
export class SalesModule {
  constructor(private salesService: SalesService) {}
}
