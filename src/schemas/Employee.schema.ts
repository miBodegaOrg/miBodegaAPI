import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Shop } from "./Shop.schema";
import mongoose from "mongoose";

@Schema({ timestamps: true })
export class Employee {
    @Prop({ required: true })
    name: string

    @Prop()
    lastname: string

    @Prop()
    email: string

    @Prop({ required: true, unique: true})
    dni: string

    @Prop()
    phone: string

    @Prop({ required: true })
    password: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true })
    shop: Shop

    @Prop({ default: [] })
    permissions: string[]
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);