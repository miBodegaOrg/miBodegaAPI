import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose from "mongoose"
import { Shop } from "./Shop.schema"
import { ProductItem } from "../sales/dto/CreateSale.dto"
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({ timestamps: true })
export class Sale {
    @Prop({ type: [ProductItem], required: true })
    products: Array<ProductItem>

    @Prop({ required: true })
    status: string

    @Prop({ required: true })
    total: number

    @Prop({ required: true })
    subtotal: number

    @Prop({ required: true })
    igv: number

    @Prop({ required: true })
    discount: number

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true })
    shop: Shop;
}

export const SaleSchema = SchemaFactory.createForClass(Sale)

SaleSchema.plugin(mongoosePaginate)