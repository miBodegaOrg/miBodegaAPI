import { HttpException } from "@nestjs/common";
import mongoose from "mongoose";

export function validateObjectId(id: string, name: string): void {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException(`Invalid ${name} ID: ${id}`, 400);
}