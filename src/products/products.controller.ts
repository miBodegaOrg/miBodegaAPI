import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/CreateProduct.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateProductDto } from './dto/UpdateProduct.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Products')
@Controller('api/v1/products')
export class ProductsController {
    constructor(private productsService: ProductsService) {}

    @Get()
    @UseGuards(AuthGuard())
    getAllProducts(@Req() req) {
        return this.productsService.getAllProducts(req.user);
    }

    @Get(':id')
    @UseGuards(AuthGuard())
    async getProductById(@Param('id') id: string, @Req() req) {
        const product = await this.productsService.getProductById(id, req.user);
        if (!product) throw new HttpException('Product not found', 404);
        return product;
    }

    @Post()
    @UseGuards(AuthGuard())
    createProduct(@Body() createProductDto: CreateProductDto, @Req() req) {
        return this.productsService.createProduct(createProductDto, req.user);
    }

    @Put(':id')
    @UseGuards(AuthGuard())
    async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Req() req) {
        const product = await this.productsService.updateProduct(id, updateProductDto, req.user);
        if (!product) throw new HttpException('Product not found', 404);
        return product;
    }

    @Delete(':id')
    @UseGuards(AuthGuard())
    async removeProduct(@Param('id') id: string, @Req() req) {
        const product = await this.productsService.deleteProduct(id, req.user);
        if (!product) throw new HttpException('Product not found', 404);
        return product;
    }
}