import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/schemas/Product.schema';

@Injectable()
export class DashboardsService {

    constructor(
        @InjectModel(Product.name) private productModel: Model<Product>,
    ) {}

    getSalesByCategory() {
        return this.productModel.aggregate([
            {
              "$lookup": {
                "from": "categories",
                "localField": "category",
                "foreignField": "_id",
                "as": "category"
              }
            },
            {
              "$unwind": "$category"
            },
            {
              "$group": {
                "_id": "$category.name",
                "totalSales": { "$sum": "$sales" }
              }
            },
            {
              "$group": {
                "_id": null,
                "totalSalesAllCategories": { "$sum": "$totalSales" },
                "categories": {
                  "$push": {
                    "category": "$_id",
                    "totalSales": "$totalSales"
                  }
                }
              }
            },
            {
              "$unwind": "$categories"
            },
            {
              "$project": {
                "_id": "$categories.category",
                "sales": "$categories.totalSales",
                "percentage": {
                  "$divide": ["$categories.totalSales", "$totalSalesAllCategories"]
                }
              }
            }
          ]);
    }
}
