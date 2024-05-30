import { Body, Controller, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/CreateCategory.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('api/v1/categories')
export class CategoriesController {
    constructor(private categoriesService: CategoriesService) {}

    @Post()
    createCategory(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.createCategory(createCategoryDto);
    }

}
