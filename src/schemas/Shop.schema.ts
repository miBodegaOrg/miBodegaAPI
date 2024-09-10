import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Shop extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true, unique: true })
  ruc: string;

  @Prop({ required: true })
  password: string;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
