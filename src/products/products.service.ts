import { HttpException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/CreateProduct.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/schemas/Product.schema';
import mongoose, { PaginateModel } from 'mongoose';
import { UpdateProductDto } from './dto/UpdateProduct.dto';
import { Shop } from 'src/schemas/Shop.schema';
import { R2Service } from 'src/r2/r2.service';
import { generateRandom11DigitNumber } from 'src/utils/generateRandom11DigitNumber';
import { Category } from 'src/schemas/Category.schema';
import { Subcategory } from 'src/schemas/Subcategory.schema';
import { validateObjectId } from 'src/utils/validateObjectId';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product.name) private productModel: PaginateModel<Product>,
        @InjectModel('Category') private categoryModel: PaginateModel<Category>,
        @InjectModel('Subcategory') private subcategoryModel: PaginateModel<Subcategory>,
        private readonly r2Service: R2Service
    ) {}
    
    async createProduct(createProductDto: CreateProductDto, shop: Shop, image: Express.Multer.File) {
        validateObjectId(createProductDto.category);
        validateObjectId(createProductDto.subcategory);

        const product = await this.getProductByCode(createProductDto.code, shop);
        if (product) throw new HttpException(`Product with code ${createProductDto.code} already exists`, 400);

        const category = await this.categoryModel.findById(createProductDto.category);
        if (!category) throw new HttpException('Category not found', 404);

        const subcategory = await this.subcategoryModel.findById(createProductDto.subcategory);
        if (!subcategory) throw new HttpException('Subcategory not found', 404);

        if (subcategory.category.toString() !== category._id.toString()) throw new HttpException('Subcategory does not belong to category', 400);
        
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
        validateObjectId(id);

        const product = await this.productModel.findOne({ _id: id, shop: shop._id });
        if (!product) throw new HttpException('Product not found', 404);
        if (product.image_url !== '') this.r2Service.deleteFile(product.image_url.split('/').pop())
        
        return this.productModel.findOneAndDelete({ _id: id, shop: shop._id });
    }

    async updateProduct(id: string, updateProductDto: UpdateProductDto, shop: Shop, image: Express.Multer.File) {
        validateObjectId(id);
    
        const product = await this.productModel.findOne({ _id: id, shop: shop._id });
        if (!product) throw new HttpException('Product not found', 404);

        let category;
        if (updateProductDto.category && product.category.toString() !== updateProductDto.category) {
            validateObjectId(updateProductDto.category);
            category = await this.categoryModel.findById(updateProductDto.category);
            if (!category) throw new HttpException('Category not found', 404);

            if (!updateProductDto.subcategory) throw new HttpException('Subcategory is required when update category', 400);
        }

        if (updateProductDto.subcategory) {
            validateObjectId(updateProductDto.subcategory);
            if (!category) category = await this.categoryModel.findById(product.category);
            const subcategory = await this.subcategoryModel.findById(updateProductDto.subcategory);
            if (!subcategory) throw new HttpException('Subcategory not found', 404);
            if (subcategory.category.toString() !== category._id.toString()) throw new HttpException('Subcategory does not belong to category', 400);
        }

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

    async removeStock(code: string, quantity: number, shop: Shop) {
        const product = await this.getProductByCode(code, shop);
        if (!product) throw new HttpException('Product not found', 404);

        let stock = product.stock - quantity;
        if (stock < 0) stock = 0

        return this.productModel.findOneAndUpdate({ code, shop: shop._id }, { stock }, { new: true });
    }
}
