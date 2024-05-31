import { HttpException } from "@nestjs/common";
import mongoose from "mongoose";

export function validateObjectId(id: string): void {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 400);
}