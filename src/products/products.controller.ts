import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/CreateProduct.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateProductDto } from './dto/UpdateProduct.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { PermissionsGuard, Permissions } from 'src/auth/guards/permission.guard';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('api/v1/products')
export class ProductsController {
    constructor(private productsService: ProductsService) {}

    @Get()
    @UseGuards(AuthGuard())
    getAllProducts(
        @Req() req,
        @Query('search') search: string,
        @Query('category') category: string,
        @Query('subcategory') subcategory: string,
        @Query('sortBy') sortBy: string,
        @Query('orderBy') orderBy: 'ASC' | 'DESC',
        @Query('page') page: number,
        @Query('limit') limit: number
    ) {
        const filters = {
            shop: req.user,
            search: search || '',
            category: category ? category.split(',') : [],
            subcategory: subcategory ? subcategory.split(',') : [], 
            page: page ? page : 1,
            limit: limit ? limit : 20
        }

        return this.productsService.getAllProducts(filters, sortBy, orderBy);
    }

    @Get(':code')
    @UseGuards(AuthGuard())
    async getProductByCode(@Param('code') code: string, @Req() req) {
        const product = await this.productsService.getProductByCode(code, req.user);
        if (!product) throw new HttpException('Product not found', 404);
        return product;
    }

    @Post('generate-code')
    @UseGuards(AuthGuard(), PermissionsGuard)
    @Permissions('products.create')
    async generateProductCode(@Req() req) {
        const code = await this.productsService.generateProductCode(req.user);
        return { code };
    }

    @Post()
    @Permissions('products.create')
    @UseGuards(AuthGuard(), PermissionsGuard)
    @UseInterceptors(FileInterceptor('image'))
    createProduct(
        @Body() createProductDto: CreateProductDto,
        @Req() req,
        @UploadedFile() image: Express.Multer.File
    ) {
        return this.productsService.createProduct(createProductDto, req.user, image);
    }

    @Put(':id')
    @UseGuards(AuthGuard(), PermissionsGuard)
    @Permissions('products.update')
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
    @UseGuards(AuthGuard(), PermissionsGuard)
    @Permissions('products.delete')
    daleteProduct(@Param('id') id: string, @Req() req) {
        return this.productsService.deleteProduct(id, req.user);
    }
}