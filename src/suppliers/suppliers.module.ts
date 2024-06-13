import { Module } from '@nestjs/common';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService } from './suppliers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Supplier, SupplierSchema } from 'src/schemas/Supplier.schema';
import { AuthModule } from 'src/auth/auth.module';
import { Product, ProductSchema } from 'src/schemas/Product.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Supplier.name, schema: SupplierSchema },
      { name: Product.name, schema: ProductSchema }
    ])
  ],
  controllers: [SuppliersController],
  providers: [SuppliersService]
})
export class SuppliersModule {}
