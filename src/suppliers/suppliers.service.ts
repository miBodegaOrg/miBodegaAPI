import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { Supplier } from 'src/schemas/Supplier.schema';
import { CreateSupplierDto } from './dto/CreateSupplier.dto';
import { Shop } from 'src/schemas/Shop.schema';
import { UpdateSupplierDto } from './dto/UpdateSupplier.dto';
import { Product } from 'src/schemas/Product.schema';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectModel(Supplier.name) private supplierModel: PaginateModel<Supplier>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(createSupplierDto: CreateSupplierDto, shop: Shop) {
    const supplier = await this.supplierModel.findOne({
      ruc: createSupplierDto.ruc,
    });
    if (supplier)
      throw new HttpException(
        `Supplier with RUC ${createSupplierDto.ruc} already exists`,
        400,
      );

    for (let i = 0; i < createSupplierDto.products.length; i++) {
      const product = await this.productModel.findOne({
        code: createSupplierDto.products[i].code,
        shop: shop._id,
      });
      if (!product)
        throw new HttpException(
          `Product with code ${createSupplierDto.products[i].code} not found`,
          404,
        );
      if (product.supplier)
        throw new HttpException(
          `Product with code ${createSupplierDto.products[i].code} already has a supplier`,
          400,
        );

      createSupplierDto.products[i] = {
        ...createSupplierDto.products[i],
        _id: product._id,
      };
    }

    const data = Object.assign(createSupplierDto, { shop: shop._id });

    const createSupplier = new this.supplierModel(data);
    const createdSupplier = await createSupplier.save();

    for (let i = 0; i < createSupplierDto.products.length; i++) {
      await this.productModel.updateOne(
        { code: createSupplierDto.products[i].code, shop: shop._id },
        {
          supplier: createdSupplier._id,
          cost: createSupplierDto.products[i].cost,
        },
      );
    }

    return createdSupplier;
  }

  async getAllSuppliers(shop: Shop) {
    const suppliers = await this.supplierModel.aggregate([
      {
        $match: { shop: shop._id },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'products._id',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $project: {
          name: 1,
          phone: 1,
          ruc: 1,
          shop: 1,
          createdAt: 1,
          updatedAt: 1,
          products: {
            $map: {
              input: '$products',
              as: 'product',
              in: {
                $mergeObjects: [
                  '$$product',
                  {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$productDetails',
                          as: 'detail',
                          cond: { $eq: ['$$detail._id', '$$product._id'] },
                        },
                      },
                      0,
                    ],
                  },
                ],
              },
            },
          },
        },
      },
    ]);
    return suppliers;
  }

  async getSupplierByRuc(ruc: string, shop: Shop) {
    const supplier = await this.supplierModel.aggregate([
      {
        $match: { ruc, shop: shop._id },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'products._id',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $project: {
          name: 1,
          phone: 1,
          ruc: 1,
          shop: 1,
          createdAt: 1,
          updatedAt: 1,
          products: {
            $map: {
              input: '$products',
              as: 'product',
              in: {
                $mergeObjects: [
                  '$$product',
                  {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$productDetails',
                          as: 'detail',
                          cond: { $eq: ['$$detail._id', '$$product._id'] },
                        },
                      },
                      0,
                    ],
                  },
                ],
              },
            },
          },
        },
      },
    ]);
    if (supplier.length == 0)
      throw new HttpException(`Supplier with RUC ${ruc} not found`, 404);

    return supplier[0];
  }

  async update(ruc: string, shop: Shop, updateSupplierDto: UpdateSupplierDto) {
    const supplier = await this.supplierModel.findOne({ ruc, shop: shop._id });
    if (!supplier)
      throw new HttpException(`Supplier with RUC ${ruc} not found`, 404);

    if (updateSupplierDto.products) {
      for (let i = 0; i < updateSupplierDto.products.length; i++) {
        const product = await this.productModel.findOne({
          code: updateSupplierDto.products[i].code,
          shop: shop._id,
        });
        if (!product)
          throw new HttpException(
            `Product with code ${updateSupplierDto.products[i].code} not found`,
            404,
          );
        if (product.supplier && product.supplier != supplier._id)
          throw new HttpException(
            `Product with code ${updateSupplierDto.products[i].code} already has a supplier`,
            400,
          );

        updateSupplierDto.products[i] = {
          ...updateSupplierDto.products[i],
          _id: product._id,
        };
      }
    }

    const updatedSupplier = await this.supplierModel.findOneAndUpdate(
      { ruc, shop: shop._id },
      updateSupplierDto,
      { new: true },
    );

    await this.productModel.updateMany(
      { supplier: supplier._id, shop: shop._id },
      { $unset: { supplier: '', cost: '' } },
    );

    for (let i = 0; i < updateSupplierDto.products.length; i++) {
      await this.productModel.updateOne(
        { code: updateSupplierDto.products[i].code, shop: shop._id },
        {
          supplier: updatedSupplier._id,
          cost: updateSupplierDto.products[i].cost,
        },
      );
    }

    return updatedSupplier;
  }

  async remove(ruc: string, shop: Shop) {
    const supplier = await this.supplierModel.findOneAndDelete({
      ruc,
      shop: shop._id,
    });
    if (!supplier)
      throw new HttpException(`Supplier with RUC ${ruc} not found`, 404);

    return supplier;
  }
}
