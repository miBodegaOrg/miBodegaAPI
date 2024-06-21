import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Shop } from "./Shop.schema";
import { Product } from "./Product.schema";

@Schema()
export class Discount {
    @Prop({ required: true, unique: true })
    name: string

    @Prop()
    startDate: Date
    
    @Prop()
    endDate: Date

    @Prop({ required: true })
    percentage: boolean

    @Prop({ required: true })
    value: number

    @Prop({ required: true })
    active: boolean

    @Prop({ type: Array<mongoose.Schema.Types.ObjectId>, ref: 'Product', required: true })  
    products: Product[]

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true })
    shop: Shop;
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);