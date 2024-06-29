import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Product } from "./Product.schema";
import mongoose from "mongoose";
import { Shop } from "./Shop.schema";

@Schema({ timestamps: true })
export class Promotion {
    @Prop({ required: true })
    name: string;

    @Prop()
    startDate: Date;

    @Prop()
    endDate: Date;

    @Prop({ required: true })
    buy: number;

    @Prop({ required: true })
    pay: number;

    @Prop({ required: true })
    active: boolean;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], required: true })
    products: Product[]

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true })
    shop: Shop;
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);