import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Category } from 'src/schemas/Category.schema';
import { Subcategory } from 'src/schemas/Subcategory.schema';
import { CreateSubcategoryDto } from './dto/CreateSubcategory.dto';

@Injectable()
export class SubcategoriesService {

    constructor(
        @InjectModel(Subcategory.name) private subcategorymodel: Model<Subcategory>,
        @InjectModel(Category.name) private categorymodel: Model<Category>
    ) {}

    async createSubcategory(createSubcategoryDto: CreateSubcategoryDto) {
        const isValid = mongoose.Types.ObjectId.isValid(createSubcategoryDto.category);
        if (!isValid) throw new HttpException('Invalid ID', 400);

        const category = await this.categorymodel.findById(createSubcategoryDto.category);
        if (!category) throw new HttpException('Category not found', HttpStatus.NOT_FOUND);

        const subcategory = new this.subcategorymodel(createSubcategoryDto);
        const createdSubcategory = await subcategory.save();
        await category.updateOne({ $push: { subcategories: createdSubcategory._id } });
        return createdSubcategory;
    }

}
