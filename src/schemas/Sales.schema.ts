import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose from "mongoose"
import { Shop } from "./Shop.schema"
import { Product } from "../sales/dto/CreateSale.dto"

@Schema({ timestamps: true })
export class Sale {
    @Prop({ type: [Product], required: true })
    products: Array<Product>

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