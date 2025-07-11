import { ProductsModel } from "../models/products";
import { AccountsModel } from "../models/accounts";
import { IProduct } from "../interfaces/product";
import { ApolloError } from "apollo-server-errors";
import { logger } from "../config/logger";

export class ProductService {

    async create(
        input: Pick<IProduct, "name" | "sku" | "stock" | "accountId">
    ): Promise<IProduct> {
        logger.info({ input }, "ProductService.create called");


        const exists = await AccountsModel.exists({ _id: input.accountId });
        if (!exists) {
            logger.warn({ accountId: input.accountId }, "Account not found");
            throw new ApolloError("Cuenta no encontrada", "NOT_FOUND");
        }

        try {
            const doc = await ProductsModel.create(input);
            logger.debug({ productId: doc._id }, "Product persisted");
            return doc.toObject();
        } catch (err: any) {
            logger.error({ err, sku: input.sku }, "Error creating product");
            if (err.code === 11000) {
                throw new ApolloError("SKU duplicado", "BAD_USER_INPUT");
            }
            throw err;
        }
    }


    async getById(id: string): Promise<IProduct> {
        logger.info({ productId: id }, "ProductService.getById called");
        const doc = await ProductsModel.findById(id);
        if (!doc) {
            logger.warn({ productId: id }, "Product not found");
            throw new ApolloError("Producto no encontrado", "NOT_FOUND");
        }
        const result = doc.toObject();
        logger.debug({ product: result }, "Product fetched");
        return result;
    }


    async listByAccount(
        accountId: string,
        page = 1,
        limit = 10
    ): Promise<{ items: IProduct[]; total: number; page: number; limit: number }> {
        logger.info(
            { accountId, page, limit },
            "ProductService.listByAccount called"
        );

        const exists = await AccountsModel.exists({ _id: accountId });
        if (!exists) {
            logger.warn({ accountId }, "Account not found in listByAccount");
            throw new ApolloError("Cuenta no encontrada", "NOT_FOUND");
        }

        const filter = { accountId };
        const total = await ProductsModel.countDocuments(filter);
        const docs = await ProductsModel.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        const items = docs.map((d) => d.toObject());
        logger.debug(
            { returned: items.length, total },
            "Products listed for account"
        );
        return { items, total, page, limit };
    }


    async purchase(
        accountId: string,
        productId: string,
        quantity: number
    ): Promise<string> {
        logger.info(
            { accountId, productId, quantity },
            "ProductService.purchase called"
        );

        if (!(await AccountsModel.exists({ _id: accountId }))) {
            logger.warn({ accountId }, "Account not found in purchase");
            throw new ApolloError("Cuenta no encontrada", "NOT_FOUND");
        }

        const prod = await ProductsModel.findById(productId);
        if (!prod) {
            logger.warn({ productId }, "Product not found in purchase");
            throw new ApolloError("Producto no encontrado", "NOT_FOUND");
        }

        if (prod.stock < quantity) {
            logger.warn(
                { productId, stock: prod.stock, requested: quantity },
                "Insufficient stock"
            );
            throw new ApolloError("Stock insuficiente", "BAD_REQUEST");
        }

        prod.stock -= quantity;
        await prod.save();
        logger.debug(
            { productId, newStock: prod.stock },
            "Stock updated after purchase"
        );

        const message = `Compra exitosa: ${quantity} unidad(es) de "${prod.name}"`;
        logger.info({ message }, "Purchase completed successfully");
        return message;
    }
}