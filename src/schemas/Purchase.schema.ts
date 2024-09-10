import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Shop } from './Shop.schema';
import mongoose from 'mongoose';
import { PurchaseProduct } from 'src/purchases/dto/CreatePurchase.dto';

@Schema({ timestamps: true })
export class Purchase {
  @Prop({ required: true })
  products: Array<PurchaseProduct>;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  total: number;

  @Prop({ required: true })
  subtotal: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true })
  shop: Shop;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true,
  })
  supplier: string;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
