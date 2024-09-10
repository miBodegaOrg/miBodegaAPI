import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Shop } from './Shop.schema';
import { Category } from './Category.schema';
import { Subcategory } from './Subcategory.schema';
import { Supplier } from './Supplier.schema';

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  stock: number;

  @Prop({ default: '' })
  image_url: string;

  @Prop({ default: 0 })
  sales: number;

  @Prop({ required: true, default: false })
  weight: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: Category;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
    required: true,
  })
  subcategory: Subcategory;

  @Prop({ type: {} })
  activePromo: {
    id: string;
    type: string;
  };

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true })
  shop: Shop;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' })
  supplier: mongoose.Types.ObjectId;

  @Prop()
  cost: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.plugin(mongoosePaginate);
