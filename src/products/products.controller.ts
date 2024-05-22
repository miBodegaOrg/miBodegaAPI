import { Body, Controller, Delete, Get, HttpException, Param, Post, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/CreateProduct.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateProductDto } from './dto/UpdateProduct.dto';

@ApiTags('products')
@Controller('api/v1/products')
export class ProductsController {
    constructor(private productsService: ProductsService) {}

    @Get()
    getAllProducts() {
        return this.productsService.getAllProducts();
    }

    @Get(':id')
    async getProductById(@Param('id') id: string) {
        const product = await this.productsService.getProductById(id);
        if (!product) throw new HttpException('Product not found', 404);
        return product;
    }

    @Post()
    createProduct(@Body() createProductDto: CreateProductDto) {
        return this.productsService.createProduct(createProductDto);
    }

    @Put(':id')
    async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        const product = await this.productsService.updateProduct(id, updateProductDto);
        if (!product) throw new HttpException('Product not found', 404);
        return product;
    }

    @Delete(':id')
    async removeProduct(@Param('id') id: string) {
        const product = await this.productsService.deleteProduct(id);
        if (!product) throw new HttpException('Product not found', 404);
        return product;
    }
}