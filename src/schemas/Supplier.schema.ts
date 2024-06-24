import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Shop } from "./Shop.schema";
import * as mongoosePaginate from 'mongoose-paginate-v2';
import mongoose from "mongoose";
import { ProductItem } from "src/sales/dto/CreateSale.dto";

@Schema({ timestamps: true })
export class Supplier {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true, unique: true })
    ruc: string;

    @Prop({ type: [ProductItem], default: [] })
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        cost: number,
        code: string
    }]

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true })
    shop: Shop;
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);

SupplierSchema.plugin(mongoosePaginate);