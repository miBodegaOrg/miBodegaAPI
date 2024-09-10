import { Module } from '@nestjs/common';
import { BarcodeController } from './barcode.controller';
import { BarcodeService } from './barcode.service';
import { ProductsModule } from 'src/products/products.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ProductsModule, AuthModule],
  controllers: [BarcodeController],
  providers: [BarcodeService],
})
export class BarcodeModule {}
