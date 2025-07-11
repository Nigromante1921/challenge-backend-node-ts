import { Schema, Document } from "mongoose";
import { IProduct } from "../interfaces/product";
import { cnxProducts} from "../db/mongodb";

interface ProductDoc extends IProduct, Document {}

const productSchema = new Schema<ProductDoc>(
    {
        name:      { type: String, required: true },
        sku:       { type: String, required: true },
        stock:     { type: Number, required: true, min: 0 },
        accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    },
    {
        timestamps: true,
        collection: "products",
    }
);

productSchema.index({ sku: 1 }, { unique: true });

export const ProductsModel = cnxProducts.model<ProductDoc>(
    "Product",
    productSchema
);