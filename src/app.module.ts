import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://gonchis:GQ7wyqvCOoe3ozHb@devcluster.lvcivvg.mongodb.net/miBodegaDB'),
    ProductsModule
  ],
  controllers: [
  ],
  providers: [],
})
export class AppModule {}
