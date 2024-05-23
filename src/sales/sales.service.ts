import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sale } from 'src/schemas/Sales.schema';

@Injectable()
export class SalesService {
    constructor(@InjectModel(Sale.name) private saleModel: Model<Sale>) {}
}
