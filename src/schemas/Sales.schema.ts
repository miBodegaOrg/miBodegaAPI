import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Product } from "./Product.schema"

@Schema({ timestamps: true })
export class Sale {
    @Prop({ type: [Product], required: true })
    products: Array<Product>

    @Prop({ required: true })
    total: number
}

export const SaleSchema = SchemaFactory.createForClass(Sale)