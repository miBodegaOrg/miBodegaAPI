import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Subcategory {
    @Prop({ required: true })
    name: string;
}

export const SubcategorySchema = SchemaFactory.createForClass(Subcategory);