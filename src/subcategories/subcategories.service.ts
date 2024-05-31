import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Category } from 'src/schemas/Category.schema';
import { Subcategory } from 'src/schemas/Subcategory.schema';
import { CreateSubcategoryDto } from './dto/CreateSubcategory.dto';

@Injectable()
export class SubcategoriesService {

    constructor(
        @InjectModel(Subcategory.name) private subcategoryModel: Model<Subcategory>,
        @InjectModel(Category.name) private categoryModel: Model<Category>
    ) {}

    async createSubcategory(createSubcategoryDto: CreateSubcategoryDto) {
        const isValid = mongoose.Types.ObjectId.isValid(createSubcategoryDto.category);
        if (!isValid) throw new HttpException('Invalid ID', 400);

        const category = await this.categoryModel.findById(createSubcategoryDto.category);
        if (!category) throw new HttpException('Category not found', HttpStatus.NOT_FOUND);

        const subcategory = await this.subcategoryModel.findOne({ name: createSubcategoryDto.name });
        if (subcategory) throw new HttpException('Subcategory with this name already exists', 400)

        const createSubcategory = new this.subcategoryModel(createSubcategoryDto);
        const createdSubcategory = await createSubcategory.save();
        await category.updateOne({ $push: { subcategories: createdSubcategory._id } });
        return createdSubcategory;
    }

}
