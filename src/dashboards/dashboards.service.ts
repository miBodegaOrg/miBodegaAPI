import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/schemas/Product.schema';
import { Sale } from 'src/schemas/Sales.schema';
import { Shop } from 'src/schemas/Shop.schema';

@Injectable()
export class DashboardsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Sale.name) private saleModel: Model<Sale>,
  ) {}

  getSalesByCategory(shop: Shop) {
    return this.productModel.aggregate([
      {
        $match: {
          shop: shop._id,
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
      {
        $group: {
          _id: '$category.name',
          totalSales: { $sum: '$sales' },
        },
      },
      {
        $group: {
          _id: null,
          totalSalesAllCategories: { $sum: '$totalSales' },
          categories: {
            $push: {
              category: '$_id',
              totalSales: '$totalSales',
            },
          },
        },
      },
      {
        $unwind: '$categories',
      },
      {
        $project: {
          _id: '$categories.category',
          sales: '$categories.totalSales',
          percentage: {
            $divide: ['$categories.totalSales', '$totalSalesAllCategories'],
          },
        },
      },
    ]);
  }

  getSalesDashboard(shop: Shop, period: 'day' | 'week' | 'month' | 'year') {
    if (
      period !== 'day' &&
      period !== 'week' &&
      period !== 'month' &&
      period !== 'year'
    )
      throw new HttpException('Invalid period', 400);

    const dateFilter = {
      day: {
        filter: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        format: '%H:00',
      },
      week: {
        filter: new Date(new Date().setDate(new Date().getDate() - 7)),
        format: '%m-%d',
      },
      month: {
        filter: new Date(new Date().setDate(new Date().getDate() - 30)),
        format: '%m-%d',
      },
      year: {
        filter: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        format: '%Y-%m',
      },
    };

    return this.saleModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: dateFilter[period].filter,
          },
          status: 'paid',
          shop: shop._id,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: dateFilter[period].format,
              date: '$createdAt',
              timezone: 'America/Lima',
            },
          },
          sales: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
  }

  async getRentabilityDashboard(shop: Shop) {
    return this.productModel.aggregate([
      {
        $match: {
          shop: shop._id,
        },
      },
      {
        $lookup: {
          from: 'sales',
          let: { productCode: '$code' },
          pipeline: [
            { $unwind: '$products' },
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$products.code', '$$productCode'] },
                    { $eq: ['$status', 'paid'] },
                    { $eq: ['$shop', shop._id] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                rentability: { $sum: '$products.rentability' },
              },
            },
          ],
          as: 'salesData',
        },
      },
      {
        $addFields: {
          rentability: {
            $ifNull: [{ $arrayElemAt: ['$salesData.rentability', 0] }, 0],
          },
        },
      },
      {
        $project: {
          _id: 0,
          code: 1,
          name: 1,
          rentability: 1,
        },
      },
    ]);
  }

  async getInventoryDashboard(shop: Shop) {
    return this.productModel.aggregate([
      {
        $match: {
          shop: shop._id,
        },
      },
      {
        $project: {
          _id: 0,
          code: 1,
          name: 1,
          stock: 1,
        },
      },
      {
        $sort: { stock: -1 },
      },
    ]);
  }

  getSalesTodayDashboard(shop: Shop) {
    return this.saleModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
          status: 'paid',
          shop: shop._id,
        },
      },
      {
        $group: {
          _id: null,
          sales: { $sum: 1 },
          total: { $sum: '$total' },
        },
      },
      {
        $project: {
          _id: 0,
          sales: 1,
          total: 1,
        },
      },
    ]);
  }
}
