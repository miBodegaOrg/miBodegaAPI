import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SalesModule } from './sales/sales.module';
import { R2Service } from './r2/r2.service';
import { R2Module } from './r2/r2.module';
import { BarcodeModule } from './barcode/barcode.module';
import { CategoriesModule } from './categories/categories.module';
import { SubcategoriesModule } from './subcategories/subcategories.module';
import { ChatsModule } from './chats/chats.module';
import { DashboardsModule } from './dashboards/dashboards.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { PurchasesModule } from './purchases/purchases.module';
import { EmployeesModule } from './employees/employees.module';
import { DiscountsModule } from './discounts/discounts.module';
import { PromotionsController } from './promotions/promotions.controller';
import { PromotionsModule } from './promotions/promotions.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return { uri: configService.get<string>('MONGODB_URI') };
      },
    }),
    ProductsModule,
    AuthModule,
    SalesModule,
    R2Module,
    BarcodeModule,
    CategoriesModule,
    SubcategoriesModule,
    ChatsModule,
    DashboardsModule,
    SuppliersModule,
    PurchasesModule,
    EmployeesModule,
    DiscountsModule,
    PromotionsModule,
    SettingsModule,
  ],
  controllers: [],
  providers: [R2Service],
})
export class AppModule {}
