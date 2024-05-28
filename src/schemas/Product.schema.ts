import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Shop } from "./Shop.schema";

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

    @Prop({ type: [String], default: [] })
    category: Array<string>;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true })
    shop: Shop;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.plugin(mongoosePaginate);