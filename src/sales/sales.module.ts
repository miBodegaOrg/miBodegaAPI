import { Module } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { Mongoose } from 'mongoose';
import { Sale, SaleSchema } from 'src/schemas/Sales.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Sale.name,
        schema: SaleSchema,
      },
    ]),
  ],
  controllers: [SalesController],
  providers: [SalesService]
})
export class SalesModule {
  constructor(private salesService: SalesService) {}
}
