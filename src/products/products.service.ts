import { HttpException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/CreateProduct.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/schemas/Product.schema';
import mongoose, { PaginateModel } from 'mongoose';
import { UpdateProductDto } from './dto/UpdateProduct.dto';
import { Shop } from 'src/schemas/Shop.schema';
import { R2Service } from 'src/r2/r2.service';
import { generateRandom11DigitNumber } from 'src/utils/generateRandom11DigitNumber';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product.name) private productModel: PaginateModel<Product>,
        private readonly r2Service: R2Service
    ) {}
    
    async createProduct(createProductDto: CreateProductDto, shop: Shop, image: Express.Multer.File) {
        let url = ''
        if (image) url = await this.r2Service.uploadFile(image.buffer, image.mimetype);

        const data = Object.assign(createProductDto, { shop: shop._id, image_url: url});

        const createdProduct = new this.productModel(data);
        return createdProduct.save();
    }

    getAllProducts(shop: Shop, search: string, page: number, limit: number) {

        const searchQuery = search ? {
            name: {
                $regex: search,
                $options: 'i'
            }
        } : {}

        return this.productModel.paginate({ shop: shop._id, ...searchQuery }, { page, limit })
    }

    getProductByCode(code: string, shop: Shop) {
        return this.productModel.findOne({ code, shop: shop._id });
    }

    async deleteProduct(id: string, shop: Shop) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid ID', 400);

        const product = await this.productModel.findOne({ _id: id, shop: shop._id });
        if (!product) throw new HttpException('Product not found', 404);
        if (product.image_url !== '') this.r2Service.deleteFile(product.image_url.split('/').pop())
        
        return this.productModel.findOneAndDelete({ _id: id, shop: shop._id });
    }

    async updateProduct(id: string, updateProductDto: UpdateProductDto, shop: Shop, image: Express.Multer.File) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid ID', 400);

        const product = await this.productModel.findOne({ _id: id, shop: shop._id });
        if (!product) throw new HttpException('Product not found', 404);

        if (product.image_url !== '') await this.r2Service.deleteFile(product.image_url.split('/').pop());   

        if (image) {
            let url = await this.r2Service.uploadFile(image.buffer, image.mimetype);
            return this.productModel.findOneAndUpdate({ _id: id, shop: shop._id }, { ...updateProductDto, image_url: url }, { new: true });
        } 
        
        return this.productModel.findOneAndUpdate({ _id: id, shop: shop._id }, updateProductDto, { new: true });
    }

    async generateProductCode(shop: Shop) {
        let code = generateRandom11DigitNumber();
        while (await this.getProductByCode(code, shop)) {
            code = generateRandom11DigitNumber();
        }

        return code;
    }
}
