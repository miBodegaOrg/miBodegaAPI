import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/CreateCategory.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @Get()
  getCategories() {
    return this.categoriesService.getCategories();
  }

  @Get('with-products')
  getCategoryWithProducts() {
    return this.categoriesService.getCategoriesWithProducts();
  }
}
