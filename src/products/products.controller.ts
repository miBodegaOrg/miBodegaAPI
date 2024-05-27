import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/CreateProduct.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateProductDto } from './dto/UpdateProduct.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Query as ExpressQuery } from 'express-serve-static-core';

@ApiTags('Products')
@Controller('api/v1/products')
export class ProductsController {
    constructor(private productsService: ProductsService) {}

    @Get()
    @UseGuards(AuthGuard())
    getAllProducts(@Req() req, @Query('search') search: string, @Query('page') page: number, @Query('limit') limit: number) {
        return this.productsService.getAllProducts(req.user, search, page, limit);
    }

    @Get(':code')
    @UseGuards(AuthGuard())
    async getProductByCode(@Param('code') code: string, @Req() req) {
        const product = await this.productsService.getProductByCode(code, req.user);
        if (!product) throw new HttpException('Product not found', 404);
        return product;
    }

    @Post('generate-code')
    @UseGuards(AuthGuard())
    async generateProductCode(@Req() req) {
        const code = await this.productsService.generateProductCode(req.user);
        return { code };
    }

    @Post()
    @UseGuards(AuthGuard())
    @UseInterceptors(FileInterceptor('image'))
    createProduct(
        @Body() createProductDto: CreateProductDto,
        @Req() req,
        @UploadedFile() image: Express.Multer.File
    ) {
        return this.productsService.createProduct(createProductDto, req.user, image);
    }

    @Put(':id')
    @UseGuards(AuthGuard())
    @UseInterceptors(FileInterceptor('image'))
    async updateProduct(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
        @Req() req,
        @UploadedFile() image: Express.Multer.File
    ) {
        const product = await this.productsService.updateProduct(id, updateProductDto, req.user, image);
        if (!product) throw new HttpException('Product not found', 404);
        return product;
    }

    @Delete(':id')
    @UseGuards(AuthGuard())
    daleteProduct(@Param('id') id: string, @Req() req) {
        return this.productsService.deleteProduct(id, req.user);
    }
}