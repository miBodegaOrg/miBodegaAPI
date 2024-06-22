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
        const supplier = await this.supplierModel.findOne({ ruc: createSupplierDto.ruc });
        if (supplier) throw new HttpException(`Supplier with RUC ${createSupplierDto.ruc} already exists`, 400);

        for (let i = 0; i < createSupplierDto.products.length; i++) {
            let product = await this.productModel.findOne({ code: createSupplierDto.products[i].code, shop: shop._id })
            if (!product) throw new HttpException(`Product with code ${createSupplierDto.products[i].code} not found`, 404);
        }

        const data = Object.assign(createSupplierDto, { shop: shop._id });

        const createSupplier = new this.supplierModel(data);
        return createSupplier.save();
    }

    getAllSuppliers(shop: Shop) {
        return this.supplierModel.find({ shop: shop._id });
    }

    async getSupplierByRuc(ruc: string, shop: Shop) {
        const supplier = await this.supplierModel.findOne({ ruc, shop: shop._id });
        if (!supplier) throw new HttpException(`Supplier with RUC ${ruc} not found`, 404);

        return supplier;
    }

    async update(ruc: string, shop: Shop, updateSupplierDto: UpdateSupplierDto) {
        const supplier = await this.supplierModel.findOneAndUpdate({ ruc, shop: shop._id }, updateSupplierDto, { new: true });
        if (!supplier) throw new HttpException(`Supplier with RUC ${ruc} not found`, 404);

        return supplier;
    }

    async remove(ruc: string, shop: Shop) {
        const supplier = await this.supplierModel.findOneAndDelete({ ruc, shop: shop._id });
        if (!supplier) throw new HttpException(`Supplier with RUC ${ruc} not found`, 404);

        return supplier;
    }
}