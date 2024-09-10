import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Shop } from './Shop.schema';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import mongoose from 'mongoose';
import { SupplierProduct } from 'src/suppliers/dto/CreateSupplier.dto';

@Schema({ timestamps: true })
export class Supplier {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true, unique: true })
  ruc: string;

  @Prop({
    type: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        cost: { type: Number, required: true },
        code: { type: String, required: true },
      },
    ],
    default: [],
  })
  products: SupplierProduct[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true })
  shop: Shop;
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);

SupplierSchema.plugin(mongoosePaginate);
