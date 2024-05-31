import { Body, Controller, Post } from '@nestjs/common';
import { SubcategoriesService } from './subcategories.service';
import { CreateSubcategoryDto } from './dto/CreateSubcategory.dto';

@Controller('api/v1/subcategories')
export class SubcategoriesController {
    constructor(private subcategoriesService: SubcategoriesService) {}

    @Post()
    createSubcategory(@Body() createSubcategoryDto: CreateSubcategoryDto) {
        return this.subcategoriesService.createSubcategory(createSubcategoryDto);
    }
}
