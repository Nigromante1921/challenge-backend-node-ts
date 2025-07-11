import { Types } from "mongoose";

export interface IProduct {
  name: string;
  sku: string;
  stock: number;
  accountId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
