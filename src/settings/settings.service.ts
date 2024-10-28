import { Injectable } from '@nestjs/common';
import { Shop } from '../schemas/Shop.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Sale } from '../schemas/Sales.schema';
import { Model, PaginateModel } from 'mongoose';
import { Product } from '../schemas/Product.schema';
import { Discount } from '../schemas/Discount.schema';
import { Promotion } from '../schemas/Promotion.schema';
import { Chat } from '../schemas/Chat.schema';
import { Employee } from '../schemas/Employee.schema';
import { Purchase } from '../schemas/Purchase.schema';
import { Supplier } from '../schemas/Supplier.schema';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Sale.name) private saleModel: PaginateModel<Sale>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Discount.name) private discountModel: Model<Discount>,
    @InjectModel(Promotion.name) private promotionModel: Model<Promotion>,
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
    @InjectModel(Purchase.name) private purchaseModel: Model<Purchase>,
    @InjectModel(Supplier.name) private supplierModel: Model<Supplier>,
  ) {}

  async deleteAllData(shop: Shop) {
    await this.saleModel.deleteMany({ shop: shop._id });
    await this.productModel.deleteMany({ shop: shop._id });
    await this.discountModel.deleteMany({ shop: shop._id });
    await this.promotionModel.deleteMany({ shop: shop._id });
    await this.chatModel.deleteMany({ shop: shop._id });
    await this.employeeModel.deleteMany({ shop: shop._id });
    await this.purchaseModel.deleteMany({ shop: shop._id });
    await this.supplierModel.deleteMany({ shop: shop._id });

    return 'All data deleted';
  }
}
