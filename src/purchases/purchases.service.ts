import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Purchase } from 'src/schemas/Purchase.schema';
import { Shop } from 'src/schemas/Shop.schema';
import { CreatePurchaseDto } from './dto/CreatePurchase.dto';
import { Supplier } from 'src/schemas/Supplier.schema';
import { Product } from 'src/schemas/Product.schema';
import { stat } from 'fs';
import { validateObjectId } from 'src/utils/validateObjectId';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectModel(Purchase.name) private purchaseModel: Model<Purchase>,
    @InjectModel(Supplier.name) private supplierModel: Model<Supplier>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  getAllPurchases(shop: Shop) {
    return this.purchaseModel.find({ shop: shop._id });
  }

  getPurchaseById(id: string, shop: Shop) {
    validateObjectId(id, 'purchase');
    return this.purchaseModel.findOne({ _id: id, shop: shop._id });
  }

  async createPurchase(createPurchaseDto: CreatePurchaseDto, shop: Shop) {
    const supplier = await this.supplierModel.findOne({
      ruc: createPurchaseDto.ruc,
      shop: shop._id,
    });
    if (!supplier)
      throw new HttpException(
        `Supplier with RUC ${createPurchaseDto.ruc} not found`,
        404,
      );

    let subtotal = 0;

    for (let i = 0; i < createPurchaseDto.products.length; i++) {
      const product = await this.productModel.findOne({
        code: createPurchaseDto.products[i].code,
        shop: shop._id,
      });
      if (!product)
        throw new HttpException(
          `Product with code ${createPurchaseDto.products[i].code} not found`,
          404,
        );

      if (
        !product.weight &&
        !Number.isInteger(createPurchaseDto.products[i].quantity)
      )
        throw new HttpException(
          'Quantity must be an integer if product is not weight type',
          400,
        );

      if (supplier.products.findIndex((p) => p.code === product.code) === -1)
        throw new HttpException(
          `Product with code ${product.code} not found in supplier`,
          404,
        );

      const price = supplier.products.find((p) => p.code === product.code).cost;
      subtotal += price * createPurchaseDto.products[i].quantity;
    }

    const discount = createPurchaseDto.discount
      ? createPurchaseDto.discount
      : 0;
    const shipping = createPurchaseDto.shipping
      ? createPurchaseDto.shipping
      : 0;

    const total = subtotal - discount + shipping;

    const data = Object.assign(createPurchaseDto, {
      shop: shop._id,
      supplier: supplier._id,
      total,
      subtotal,
      status: 'in progress',
    });

    const purchase = new this.purchaseModel(data);
    return purchase.save();
  }

  async receivedPurchase(id: string, shop: Shop) {
    validateObjectId(id, 'purchase');
    const purchase = await this.purchaseModel.findOne({
      _id: id,
      shop: shop._id,
    });
    if (!purchase)
      throw new HttpException(`Purchase with id ${id} not found`, 404);

    if (purchase.status === 'received')
      throw new HttpException(`Purchase with id ${id} already received`, 400);

    const receivedPurchase = await this.purchaseModel.findOneAndUpdate(
      { _id: id, shop: shop._id },
      { status: 'received' },
      { new: true },
    );

    for (let i = 0; i < purchase.products.length; i++) {
      await this.productModel.updateOne(
        { code: purchase.products[i].code, shop: shop._id },
        { $inc: { stock: purchase.products[i].quantity } },
      );
    }

    return receivedPurchase;
  }
}
