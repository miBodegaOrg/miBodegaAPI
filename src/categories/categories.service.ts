import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/schemas/Category.schema';
import { CreateCategoryDto } from './dto/CreateCategory.dto';

@Injectable()
export class CategoriesService {
    constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {}

    async createCategory(createCategoryDto: CreateCategoryDto) {
        const category = new this.categoryModel(createCategoryDto);
        return category.save();
    }

    async getCategories() {
        return this.categoryModel.find().populate('subcategories', 'name');
    }
}
