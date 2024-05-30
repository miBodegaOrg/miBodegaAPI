import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Subcategory } from "./Subcategory.schema";
import mongoose from "mongoose";

@Schema({ timestamps: true })
export class Category {
    @Prop({ required: true })
    name: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory'}], default: [] })
    subcategories: Subcategory[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);