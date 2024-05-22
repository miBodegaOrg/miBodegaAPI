import { HttpException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/CreateProduct.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/schemas/Product.schema';
import mongoose, { Model } from 'mongoose';
import { UpdateProductDto } from './dto/UpdateProduct.dto';

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}
    
    createProduct(createProductDto: CreateProductDto) {
        const createdProduct = new this.productModel(createProductDto);
        return createdProduct.save();
    }

    getAllProducts() {
        return this.productModel.find();
    }

    getProductById(id: string) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Product not found', 404);
        
        return this.productModel.findById(id);
    }

    deleteProduct(id: string) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid ID', 400);
        
        return this.productModel.findByIdAndDelete(id);
    }

    updateProduct(id: string, updateProductDto: UpdateProductDto) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid ID', 400);
        
        return this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true });
    }
}
