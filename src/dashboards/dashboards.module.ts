import { Module } from '@nestjs/common';
import { DashboardsController } from './dashboards.controller';
import { DashboardsService } from './dashboards.service';
import { Product, ProductSchema } from 'src/schemas/Product.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Sale, SaleSchema } from 'src/schemas/Sales.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Sale.name, schema: SaleSchema}
    ])
  ],
  controllers: [DashboardsController],
  providers: [DashboardsService]
})
export class DashboardsModule {}
