import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SalesModule } from './sales/sales.module';
import { R2Service } from './r2/r2.service';
import { R2Module } from './r2/r2.module';
import { BarcodeModule } from './barcode/barcode.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return { uri: configService.get<string>('MONGODB_URI')}
      }
    }),
    ProductsModule,
    AuthModule,
    SalesModule,
    R2Module,
    BarcodeModule,
  ],
  controllers: [
  ],
  providers: [R2Service],
})
export class AppModule {}
