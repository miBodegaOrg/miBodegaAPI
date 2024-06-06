import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/schemas/Category.schema';
import { CreateCategoryDto } from './dto/CreateCategory.dto';
import { Product } from 'src/schemas/Product.schema';

@Injectable()
export class CategoriesService {
    constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {}

    async createCategory(createCategoryDto: CreateCategoryDto) {
        const category = await this.categoryModel.findOne({ name: createCategoryDto.name });
        if (category) throw new HttpException('Category with this name already exists', 400)

        const createCategory = new this.categoryModel(createCategoryDto);
        return createCategory.save();
    }

    async getCategories() {
        return this.categoryModel.find().populate('subcategories', 'name');
    }

    async getCategoriesWithProducts() {
        return this.categoryModel.aggregate([
            {
                $lookup: {
                  from: "products",
                  localField: "_id",
                  foreignField: "category",
                  as: "products"
                }
            },
            {
                $match: {
                  products: { $ne: [] }
                }
            },
            {
                $project: {
                  _id: 1,
                  name: 1,
                }
            }   
        ])
    }
}
