import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Discount } from 'src/schemas/Discount.schema';
import { Shop } from 'src/schemas/Shop.schema';
import { CreateDiscountDto } from './dto/CreateDiscount..dto';
import { validateObjectId } from 'src/utils/validateObjectId';
import { Product } from 'src/schemas/Product.schema';
import { UpdateDiscountDto } from './dto/UpdateDiscount.dto';
import { PromotionsService } from '../promotions/promotions.service';

@Injectable()
export class DiscountsService {
  constructor(
    @InjectModel(Discount.name) private discountModel: Model<Discount>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    private promotionService: PromotionsService,
  ) {}

  async getAllDiscounts(shop: Shop) {
    return this.discountModel.find({ shop: shop._id });
  }

  async getDiscountById(id: string, shop: Shop) {
    validateObjectId(id, 'Discount');
    return this.discountModel.findOne({ _id: id, shop: shop._id });
  }

  async createDiscount(createDiscountDto: CreateDiscountDto, shop: Shop) {
    const discount = await this.discountModel.findOne({
      name: createDiscountDto.name,
      shop: shop._id,
    });
    if (discount) throw new HttpException('Discount name already exists', 400);

    if (createDiscountDto.startDate > createDiscountDto.endDate)
      throw new HttpException('Start date must be before end date', 400);

    for (let i = 0; i < createDiscountDto.products.length; i++) {
      validateObjectId(createDiscountDto.products[i], 'Product');

      const product = await this.productModel.findOne({
        _id: createDiscountDto.products[i],
        shop: shop._id,
      });
      if (!product) throw new HttpException('Product not found', 404);

      if (
        await this.isActiveDiscount(
          product._id,
          createDiscountDto.startDate,
          createDiscountDto.endDate,
          shop,
        )
      )
        throw new HttpException('Product already has an active discount', 400);

      if (
        await this.promotionService.isActivePromotion(
          product._id,
          createDiscountDto.startDate,
          createDiscountDto.endDate,
          shop,
        )
      )
        throw new HttpException('Product already has an active promotion', 400);
    }

    const data = { ...createDiscountDto, shop: shop._id };

    return await this.discountModel.create(data);
  }

  async updateDiscount(
    id: string,
    updateDiscountDto: UpdateDiscountDto,
    shop: Shop,
  ) {
    validateObjectId(id, 'Discount');
    const discount = await this.discountModel.findOne({
      _id: id,
      shop: shop._id,
    });
    if (!discount) throw new HttpException('Discount not found', 404);

    if (
      updateDiscountDto.hasOwnProperty('name') &&
      updateDiscountDto.name !== discount.name
    ) {
      const discountUpdated = await this.discountModel.findOne({
        name: updateDiscountDto.name,
        shop: shop._id,
      });
      if (discountUpdated)
        throw new HttpException('Discount name already exists', 400);
    }

    if (updateDiscountDto.hasOwnProperty('products')) {
      for (let i = 0; i < updateDiscountDto.products.length; i++) {
        validateObjectId(updateDiscountDto.products[i], 'Product');

        const product = await this.productModel.findOne({
          _id: updateDiscountDto.products[i],
          shop: shop._id,
        });
        if (!product) throw new HttpException('Product not found', 404);
      }
    }

    if (
      updateDiscountDto.hasOwnProperty('startDate') &&
      updateDiscountDto.hasOwnProperty('endDate') &&
      updateDiscountDto.startDate > updateDiscountDto.endDate
    ) {
      throw new HttpException('Start date must be before end date', 400);
    } else if (
      !updateDiscountDto.hasOwnProperty('startDate') &&
      updateDiscountDto.hasOwnProperty('endDate') &&
      discount.hasOwnProperty('endDate')
    ) {
      if (updateDiscountDto.endDate < discount.startDate)
        throw new HttpException('End date must be after start date', 400);
    } else if (
      updateDiscountDto.hasOwnProperty('startDate') &&
      !updateDiscountDto.hasOwnProperty('endDate') &&
      discount.hasOwnProperty('startDate')
    ) {
      if (updateDiscountDto.startDate > discount.endDate)
        throw new HttpException('Start date must be before end date', 400);
    }

    return this.discountModel.findOneAndUpdate(
      { _id: id, shop: shop._id },
      updateDiscountDto,
      { new: true },
    );
  }

  async deleteDiscount(id: string, shop: Shop) {
    validateObjectId(id, 'Discount');

    const discount = await this.discountModel.findOne({
      _id: id,
      shop: shop._id,
    });
    if (!discount) throw new HttpException('Discount not found', 404);

    return this.discountModel.findByIdAndDelete(id);
  }

  async isActiveDiscount(
    productId,
    startDate: Date,
    endDate: Date,
    shop: Shop,
  ) {
    const discounts = await this.discountModel.find({
      products: productId,
      active: true,
      shop: shop._id,
    });
    for (let i = 0; i < discounts.length; i++) {
      if (
        (new Date(startDate) >= discounts[i].startDate &&
          new Date(startDate) <= discounts[i].endDate) ||
        (new Date(endDate) >= discounts[i].startDate &&
          new Date(endDate) <= discounts[i].endDate) ||
        (new Date(startDate) <= discounts[i].startDate && new Date(endDate) >= discounts[i].endDate)
      ) {
        return true;
      }
    }
    return false;
  }
}
