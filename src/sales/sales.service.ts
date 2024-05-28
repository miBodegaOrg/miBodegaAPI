import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sale } from 'src/schemas/Sales.schema';
import { CreateSaleDto } from './dto/CreateSale.dto';
import { Shop } from 'src/schemas/Shop.schema';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class SalesService {
    constructor(
        @InjectModel(Sale.name) private saleModel: Model<Sale>,
        private productService: ProductsService
    ) {}

    async createSale(createSaleDto: CreateSaleDto, shop: Shop) {
        let subtotal = 0;
        for (const product of createSaleDto.products) {
            let prod = await this.productService.getProductByCode(product.code, shop);
            if (!prod) throw new HttpException(`Product ${product.code} not found`, 404);
            subtotal += prod.price * product.quantity;
        }
        // TODO: Calculate discount

        const igv = subtotal * 0.18;
        const total = subtotal;
        subtotal -= igv;
        const discount = 0;

        const data = Object.assign(createSaleDto, { 
            shop: shop._id,
            status: 'pending',
            subtotal,
            igv,
            total,
            discount
        });
        

        const createdSale = new this.saleModel(data);
        return createdSale.save();
    }

    async cancelSale(id: string, shop: Shop) {
        const sale = await this.saleModel.findOne({ _id: id, shop: shop._id });
        if (!sale) throw new HttpException('Sale not found', 404);
        if (sale.status !== 'pending') throw new HttpException('Sale status must be pending', 500);

        return this.saleModel.findOneAndUpdate({ _id: id, shop: shop._id }, { status: 'cancelled' }, { new: true });;
    }

    async paidSale(id: string, shop: Shop) {
        const sale = await this.saleModel.findOne({ _id: id, shop: shop._id });
        if (!sale) throw new HttpException('Sale not found', 404);
        if (sale.status !== 'pending') throw new HttpException('Sale status must be pending', 500);

        for (const product of sale.products) {
            await this.productService.removeStock(product.code, product.quantity, shop);
        }

        return await this.saleModel.findOneAndUpdate({ _id: id, shop: shop._id }, { status: 'paid' }, { new: true });
    }
}
