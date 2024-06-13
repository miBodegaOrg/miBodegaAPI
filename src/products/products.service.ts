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
        @InjectModel(Category.name) private categoryModel: PaginateModel<Category>,
        @InjectModel(Subcategory.name) private subcategoryModel: PaginateModel<Subcategory>,
        private readonly r2Service: R2Service
    ) {}
    
    async createProduct(createProductDto: CreateProductDto, shop: Shop, image: Express.Multer.File) {
        const product = await this.getProductByCode(createProductDto.code, shop);
        if (product) throw new HttpException(`Product with code ${createProductDto.code} already exists`, 400);

        const category = await this.categoryModel.findOne({ name: createProductDto.category });
        if (!category) throw new HttpException('Category not found', 404);
        createProductDto.category = category._id.toString();

        const subcategory = await this.subcategoryModel.findOne({ name: createProductDto.subcategory });
        if (!subcategory) throw new HttpException('Subcategory not found', 404);
        createProductDto.subcategory = subcategory._id.toString();

        if (subcategory.category.toString() !== category._id.toString()) throw new HttpException('Subcategory does not belong to category', 400);
        
        let url = ''
        if (image) url = await this.r2Service.uploadFile(image.buffer, image.mimetype);

        if (!createProductDto.weight && !Number.isInteger(createProductDto.stock)) throw new HttpException('Stock must be an integer if product is not weight type', 400);

        const data = Object.assign(createProductDto, { shop: shop._id, image_url: url});

        const createProduct = new this.productModel(data);
        const createdProduct = await createProduct.save();

        await category.updateOne({ $push: { products: createdProduct._id } });
        await subcategory.updateOne({ $push: { products: createdProduct._id } });

        return createdProduct;
    }

    async getAllProducts(filters, sortBy, orderBy) {
        const query: any = { shop: filters.shop };

        if (filters.category.length > 0) {
            const categoriesId = await this.categoryModel.find({ name: { $in: filters.category } });
            query.category = { $in: categoriesId.map(category => category._id)};
         }

        if (filters.subcategory.length > 0) {
            query.subcategory = { $in: filters.subcategory };
            const subcategoriesId = await this.subcategoryModel.find({ name: { $in: filters.subcategory } });
            query.subcategory = { $in: subcategoriesId.map(subcategory => subcategory._id)};
        }

        if (filters.search) {
            query.name = {
                $regex: filters.search,
                $options: 'i'
            };
        }

        const options = {
            sort: { [sortBy]: orderBy == 'ASC' ? 1 : -1 },
            page: filters.page,
            limit: filters.limit,
            populate: [
                {
                    path: 'category',
                    select: 'name'
                },
                {
                    path: 'subcategory',
                    select: 'name'
                }
            ]
        }

        return this.productModel.paginate(query, options);
    }

    getProductByCode(code: string, shop: Shop) {
        return this.productModel.findOne({ code, shop: shop._id });
    }

    async deleteProduct(id: string, shop: Shop) {
        validateObjectId(id, 'product');

        const product = await this.productModel.findOne({ _id: id, shop: shop._id });
        if (!product) throw new HttpException('Product not found', 404);
        if (product.image_url !== '') this.r2Service.deleteFile(product.image_url.split('/').pop())
        
        const deletedProduct = await this.productModel.findOneAndDelete({ _id: id, shop: shop._id });
        await this.categoryModel.updateOne({ _id: product.category }, { $pull: { products: deletedProduct._id } });
        await this.subcategoryModel.updateOne({ _id: product.subcategory }, { $pull: { products: deletedProduct._id } });
        return deletedProduct;
    }

    async updateProduct(id: string, updateProductDto: UpdateProductDto, shop: Shop, image: Express.Multer.File) {
        validateObjectId(id, 'product');
    
        const product = await this.productModel.findOne({ _id: id, shop: shop._id });
        if (!product) throw new HttpException('Product not found', 404);

        if (updateProductDto.weight === false) {
            if (updateProductDto.stock && !Number.isInteger(updateProductDto.stock)) throw new HttpException('Stock must be an integer if product is not weight type', 400);
            if (!updateProductDto.stock && !Number.isInteger(product.stock)) throw new HttpException('Actual stock must be a integer when you update to non weight type', 400);
        } else if (!updateProductDto.hasOwnProperty('weight') && updateProductDto.hasOwnProperty('stock')) {
            if (!Number.isInteger(updateProductDto.stock) && product.weight === false) throw new HttpException('Stock must be an integer if product is not weight type', 400);
        } 

        let category;
        if (updateProductDto.category && product.category.toString() !== updateProductDto.category) {
            category = await this.categoryModel.findOne({ name: updateProductDto.category });
            if (!category) throw new HttpException('Category not found', 404);

            if (!updateProductDto.subcategory) throw new HttpException('Subcategory is required when update category', 400);
            updateProductDto.category = category._id.toString();
        }

        if (updateProductDto.subcategory) {
            if (!category) {
                category = await this.categoryModel.findOne({ name: product.category });
                updateProductDto.category = category._id.toString();
            } 
            const subcategory = await this.subcategoryModel.findOne({ name: updateProductDto.subcategory });
            if (!subcategory) throw new HttpException('Subcategory not found', 404);
            if (subcategory.category.toString() !== category._id.toString()) throw new HttpException('Subcategory does not belong to category', 400);
            updateProductDto.subcategory = subcategory._id.toString();
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
}
