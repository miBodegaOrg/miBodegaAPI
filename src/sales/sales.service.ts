import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { PaginateModel } from 'mongoose';
import { Sale } from 'src/schemas/Sales.schema';
import { CreateSaleDto } from './dto/CreateSale.dto';
import { Shop } from 'src/schemas/Shop.schema';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class SalesService {
    constructor(
        @InjectModel(Sale.name) private saleModel: PaginateModel<Sale>,
        private productService: ProductsService
    ) {}

    getAllSales(shop: Shop, start_date: Date, end_date: Date, page: number, limit: number) {

        let query = { shop: shop._id };

        if (start_date && !end_date) {
            query = Object.assign(query, { createdAt: { $gte: start_date } });
        } else if (!start_date && end_date) {
            query = Object.assign(query, { createdAt: { $lte: end_date } });
        } else if (start_date && end_date) {
            if (start_date > end_date) throw new HttpException('Start date must be less than end date', 400);
            query = Object.assign(query, { createdAt: { $gte: start_date, $lte: end_date } });
        }

        return this.saleModel.paginate(query, { page, limit });
    }

    async getSaleById(id: string, shop: Shop) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid ID', 400);

        const sale = await this.saleModel.findOne({ _id: id, shop: shop._id });
        if (!sale) throw new HttpException('Sale not found', 404);
        return sale
    }

    async createSale(createSaleDto: CreateSaleDto, shop: Shop) {
        const productCodes = createSaleDto.products.map(product => product.code);
        const uniqueCodes = new Set(productCodes);

        if (uniqueCodes.size !== productCodes.length) throw new HttpException('Products code must be unique', 400);

        let subtotal = 0;
        for (let i = 0; i < createSaleDto.products.length; i++) {
            let prod = await this.productService.getProductByCode(createSaleDto.products[i].code, shop);
            if (!prod) throw new HttpException(`Product ${createSaleDto.products[i].code} not found`, 404);
            createSaleDto.products[i].name = prod.name;
            createSaleDto.products[i].price = prod.price;
            subtotal += prod.price * createSaleDto.products[i].quantity;
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
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid ID', 400);

        const sale = await this.saleModel.findOne({ _id: id, shop: shop._id });
        if (!sale) throw new HttpException('Sale not found', 404);
        if (sale.status !== 'pending') throw new HttpException('Sale status must be pending', 500);

        return this.saleModel.findOneAndUpdate({ _id: id, shop: shop._id }, { status: 'cancelled' }, { new: true });;
    }

    async paidSale(id: string, shop: Shop) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid ID', 400);
        
        const sale = await this.saleModel.findOne({ _id: id, shop: shop._id });
        if (!sale) throw new HttpException('Sale not found', 404);
        if (sale.status !== 'pending') throw new HttpException('Sale status must be pending', 500);

        for (const product of sale.products) {
            await this.productService.removeStock(product.code, product.quantity, shop);
        }

        return await this.saleModel.findOneAndUpdate({ _id: id, shop: shop._id }, { status: 'paid' }, { new: true });
    }
}
