import { HttpException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/CreateProduct.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/schemas/Product.schema';
import mongoose, { Model } from 'mongoose';
import { UpdateProductDto } from './dto/UpdateProduct.dto';
import { Shop } from 'src/schemas/Shop.schema';
import { R2Service } from 'src/r2/r2.service';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<Product>,
        private readonly r2Service: R2Service
    ) {}
    
    async createProduct(createProductDto: CreateProductDto, shop: Shop, image: Express.Multer.File) {
        const url = await this.r2Service.uploadFile(image.buffer, image.mimetype);

        const data = Object.assign(createProductDto, { shop: shop._id, image_url: url});

        const createdProduct = new this.productModel(data);
        return createdProduct.save();
    }

    getAllProducts(shop: Shop) {
        return this.productModel.find({ shop: shop._id });
    }

    getProductById(id: string, shop: Shop) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Product not found', 404);
        
        return this.productModel.findOne({ _id: id, shop: shop._id });
    }

    deleteProduct(id: string, shop: Shop) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid ID', 400);
        
        return this.productModel.findOneAndDelete({ _id: id, shop: shop._id });
    }

    updateProduct(id: string, updateProductDto: UpdateProductDto, shop: Shop) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid ID', 400);
        
        return this.productModel.findOneAndUpdate({ _id: id, shop: shop._id }, updateProductDto, { new: true });
    }
}
