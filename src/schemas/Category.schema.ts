import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Subcategory } from "./Subcategory.schema";
import mongoose from "mongoose";
import { Product } from "./Product.schema";

@Schema({ timestamps: true })
export class Category {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory'}], default: [] })
    subcategories: Subcategory[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product'}], default: [] })
    products: Product[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);