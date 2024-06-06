import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Category } from "./Category.schema";
import mongoose from "mongoose";
import { Product } from "./Product.schema";

@Schema({ timestamps: true })
export class Subcategory {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId , ref: 'Category', required: true })
    category: Category

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product'}], default: [] })
    products: Product[];
}

export const SubcategorySchema = SchemaFactory.createForClass(Subcategory);