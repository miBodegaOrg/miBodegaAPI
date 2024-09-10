import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, PaginateModel } from 'mongoose';
import { Sale } from 'src/schemas/Sales.schema';
import { CreateSaleDto } from './dto/CreateSale.dto';
import { Shop } from 'src/schemas/Shop.schema';
import { ProductsService } from 'src/products/products.service';
import { Product } from 'src/schemas/Product.schema';
import { Discount } from 'src/schemas/Discount.schema';
import { Promotion } from 'src/schemas/Promotion.schema';

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(Sale.name) private saleModel: PaginateModel<Sale>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Discount.name) private discountModel: Model<any>,
    @InjectModel(Promotion.name) private promotionModel: Model<any>,
  ) {}

  getAllSales(
    shop: Shop,
    start_date: Date,
    end_date: Date,
    page: number,
    limit: number,
  ) {
    let query = { shop: shop._id };

    if (start_date && !end_date) {
      query = Object.assign(query, { createdAt: { $gte: start_date } });
    } else if (!start_date && end_date) {
      query = Object.assign(query, { createdAt: { $lte: end_date } });
    } else if (start_date && end_date) {
      if (start_date > end_date)
        throw new HttpException('Start date must be less than end date', 400);
      query = Object.assign(query, {
        createdAt: { $gte: start_date, $lte: end_date },
      });
    }

    return this.saleModel.paginate(query, { page, limit });
  }

  async getSaleById(id: string, shop: Shop) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 400);

    const sale = await this.saleModel.findOne({ _id: id, shop: shop._id });
    if (!sale) throw new HttpException('Sale not found', 404);
    return sale;
  }

  async createSale(createSaleDto: CreateSaleDto, shop: Shop) {
    const productCodes = createSaleDto.products.map((product) => product.code);
    const uniqueCodes = new Set(productCodes);

    if (uniqueCodes.size !== productCodes.length)
      throw new HttpException('Products code must be unique', 400);

    let subtotal = 0;
    let discount = 0;
    for (let i = 0; i < createSaleDto.products.length; i++) {
      const prod = await this.productModel.findOne({
        code: createSaleDto.products[i].code,
        shop: shop._id,
      });
      if (!prod)
        throw new HttpException(
          `Product ${createSaleDto.products[i].code} not found`,
          404,
        );
      if (!prod.weight && !Number.isInteger(createSaleDto.products[i].quantity))
        throw new HttpException(
          'Quantity must be an integer if product is not weight type',
          400,
        );

      createSaleDto.products[i].name = prod.name;
      createSaleDto.products[i].price = prod.price;

      createSaleDto.products[i].cost = prod.cost ? prod.cost : 0;

      if (prod.activePromo && prod.activePromo?.type === 'discount') {
        const discountDoc = await this.discountModel.findOne({
          _id: prod.activePromo.id,
          shop: shop._id,
        });
        if (!discountDoc) throw new HttpException('Discount not found', 404);

        createSaleDto.products[i].discount =
          prod.price - (prod.price * discountDoc.percentage) / 100;
      } else if (prod.activePromo && prod.activePromo?.type === 'promotion') {
        const promotion = await this.promotionModel.findOne({
          _id: prod.activePromo.id,
          shop: shop._id,
        });
        if (!promotion) throw new HttpException('Promotion not found', 404);

        createSaleDto.products[i].discount = promotion.price;
        const gift = promotion.buy - promotion.pay;

        createSaleDto.products[i].discount = prod.price * gift;
      } else {
        createSaleDto.products[i].discount = 0;
      }

      createSaleDto.products[i].rentability =
        createSaleDto.products[i].price -
        createSaleDto.products[i].discount -
        createSaleDto.products[i].cost;

      discount +=
        createSaleDto.products[i].discount * createSaleDto.products[i].quantity;
      subtotal += prod.price * createSaleDto.products[i].quantity;
    }

    const igv = (subtotal - discount) * 0.18;
    const total = subtotal - discount;
    subtotal -= igv;

    const data = Object.assign(createSaleDto, {
      shop: shop._id,
      status: 'pending',
      subtotal,
      igv,
      total,
      discount,
    });

    const createdSale = new this.saleModel(data);
    return createdSale.save();
  }

  async cancelSale(id: string, shop: Shop) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 400);

    const sale = await this.saleModel.findOne({ _id: id, shop: shop._id });
    if (!sale) throw new HttpException('Sale not found', 404);
    if (sale.status !== 'pending')
      throw new HttpException('Sale status must be pending', 500);

    return this.saleModel.findOneAndUpdate(
      { _id: id, shop: shop._id },
      { status: 'cancelled' },
      { new: true },
    );
  }

  async paidSale(id: string, shop: Shop) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 400);

    const sale = await this.saleModel.findOne({ _id: id, shop: shop._id });
    if (!sale) throw new HttpException('Sale not found', 404);
    if (sale.status !== 'pending')
      throw new HttpException('Sale status must be pending', 500);

    for (const productItem of sale.products) {
      const product = await this.productModel.findOne({
        code: productItem.code,
        shop: shop._id,
      });
      let stock = product.stock - productItem.quantity;
      if (stock < 0) stock = 0;

      await this.productModel.findOneAndUpdate(
        { code: productItem.code, shop: shop._id },
        { $inc: { sales: 1 }, stock },
        { new: true },
      );
    }

    return await this.saleModel.findOneAndUpdate(
      { _id: id, shop: shop._id },
      { status: 'paid' },
      { new: true },
    );
  }
}
