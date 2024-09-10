import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Shop } from './Shop.schema';

@Schema({ timestamps: true })
export class Chat {
  @Prop({ required: true })
  messages: [{ role: string; text: string }];

  @Prop({ required: true })
  thread: string;

  @Prop({ required: true })
  assistant: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true })
  shop: Shop;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
