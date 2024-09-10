import { HttpException, Injectable } from '@nestjs/common';
import * as bwipjs from 'bwip-js';
import { ProductsService } from 'src/products/products.service';
import { Shop } from 'src/schemas/Shop.schema';

@Injectable()
export class BarcodeService {
  constructor(private productService: ProductsService) {}

  async createBarcode(code: string, shop: Shop) {
    const product = await this.productService.getProductByCode(code, shop);

    if (!product) throw new HttpException('No product with this code', 400);

    try {
      return bwipjs.toBuffer({
        bcid: 'code128',
        text: code,
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: 'center',
      });
    } catch (error) {
      console.log(error);
      throw new HttpException('Error creating barcode', 500);
    }
  }
}
