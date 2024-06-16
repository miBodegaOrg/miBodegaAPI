import { Module } from '@nestjs/common';
import { PurchasesController } from './purchases.controller';
import { PurchasesService } from './purchases.service';
import { Product, ProductSchema } from 'src/schemas/Product.schema';
import { Purchase, PurchaseSchema } from 'src/schemas/Purchase.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Supplier, SupplierSchema } from 'src/schemas/Supplier.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Purchase.name, schema: PurchaseSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Supplier.name, schema: SupplierSchema }
    ])
  ],
  controllers: [PurchasesController],
  providers: [PurchasesService]
})
export class PurchasesModule {}
