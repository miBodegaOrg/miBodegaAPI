import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Promotion } from 'src/schemas/Promotion.schema';
import { Shop } from 'src/schemas/Shop.schema';
import { CreatePromotionDto } from './dto/CreatePromotion.dto';
import { UpdatePromotionDto } from './dto/UpdatePromotion.dto';
import { validateObjectId } from 'src/utils/validateObjectId';
import { Product } from 'src/schemas/Product.schema';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectModel(Promotion.name) private promotionModel: Model<Promotion>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  getPromotions(shop: Shop) {
    return this.promotionModel.find({ shop: shop._id });
  }

  getPromotion(id: string, shop: Shop) {
    validateObjectId(id, 'Promotion');
    return this.promotionModel.findOne({ _id: id, shop: shop._id });
  }

  async createPromotion(createPromotionDto: CreatePromotionDto, shop: Shop) {
    if (
      createPromotionDto.startDate &&
      createPromotionDto.endDate &&
      createPromotionDto.startDate > createPromotionDto.endDate
    )
      throw new HttpException('Start date must be before end date', 400);

    if (createPromotionDto.buy <= createPromotionDto.pay)
      throw new HttpException('Buy value must be greater than pay value', 400);

    for (let i = 0; i < createPromotionDto.products.length; i++) {
      validateObjectId(createPromotionDto.products[i], 'Product');

      const product = await this.productModel.findOne({
        _id: createPromotionDto.products[i],
        shop: shop._id,
      });
      if (!product) throw new HttpException('Product not found', 404);
    }

    const data = { ...createPromotionDto, shop: shop._id };

    return this.promotionModel.create(data);
  }

  async updatePromotion(
    id: string,
    updatePromotionDto: UpdatePromotionDto,
    shop: Shop,
  ) {
    validateObjectId(id, 'Promotion');
    const promotion = await this.promotionModel.findOne({
      _id: id,
      shop: shop._id,
    });
    if (!promotion) throw new HttpException('Promotion not found', 404);

    if (updatePromotionDto.hasOwnProperty('products')) {
      for (let i = 0; i < updatePromotionDto.products.length; i++) {
        validateObjectId(updatePromotionDto.products[i], 'Product');

        const product = await this.productModel.findOne({
          _id: updatePromotionDto.products[i],
          shop: shop._id,
        });
        if (!product) throw new HttpException('Product not found', 404);
      }
    }

    if (
      updatePromotionDto.hasOwnProperty('startDate') &&
      updatePromotionDto.hasOwnProperty('endDate') &&
      updatePromotionDto.startDate > updatePromotionDto.endDate
    ) {
      throw new HttpException('Start date must be before end date', 400);
    } else if (
      updatePromotionDto.hasOwnProperty('startDate') &&
      updatePromotionDto.hasOwnProperty('endDate') &&
      promotion.hasOwnProperty('endDate')
    ) {
      if (updatePromotionDto.endDate < promotion.startDate)
        throw new HttpException('End date must be after start date', 400);
    } else if (
      updatePromotionDto.hasOwnProperty('startDate') &&
      updatePromotionDto.hasOwnProperty('endDate') &&
      promotion.hasOwnProperty('startDate')
    ) {
      if (updatePromotionDto.startDate > promotion.endDate)
        throw new HttpException('Start date must be before end date', 400);
    }
    const data = { ...updatePromotionDto };

    return this.promotionModel.findOneAndUpdate(
      { _id: id, shop: shop._id },
      data,
      { new: true },
    );
  }

  removePromotion(id: string, shop: Shop) {
    validateObjectId(id, 'Promotion');
    const promotion = this.promotionModel.findOne({ _id: id, shop: shop._id });
    if (!promotion) throw new HttpException('Promotion not found', 404);

    return this.promotionModel.findOneAndDelete({ _id: id, shop: shop._id });
  }
}
