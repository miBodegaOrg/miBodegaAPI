import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/schemas/Product.schema';
import { AuthModule } from 'src/auth/auth.module';
import { R2Module } from 'src/r2/r2.module';
import { Category, CategorySchema } from 'src/schemas/Category.schema';
import { Subcategory, SubcategorySchema } from 'src/schemas/Subcategory.schema';
import { Supplier, SupplierSchema } from '../schemas/Supplier.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: Category.name,
        schema: CategorySchema,
      },
      {
        name: Subcategory.name,
        schema: SubcategorySchema,
      },
      {
        name: Supplier.name,
        schema: SupplierSchema,
      },
    ]),
    R2Module,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
