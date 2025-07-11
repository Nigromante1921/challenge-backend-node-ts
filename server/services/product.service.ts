import { ProductsModel } from "../models/products";
import { AccountsModel } from "../models/accounts";
import { IProduct } from "../interfaces/product";
import { ApolloError } from "apollo-server-errors";

export class ProductService {

    async create(
        input: Pick<IProduct, "name" | "sku" | "stock" | "accountId">
    ): Promise<IProduct> {
        // 1) Verificar que la cuenta exista
        if (!(await AccountsModel.exists({ _id: input.accountId }))) {
            throw new ApolloError("Cuenta no encontrada", "NOT_FOUND");
        }
        // 2) Crear
        try {
            const doc = await ProductsModel.create(input);
            return doc.toObject();
        } catch (err: any) {
            if (err.code === 11000) {
                throw new ApolloError("SKU duplicado", "BAD_USER_INPUT");
            }
            throw err;
        }
    }


    async getById(id: string): Promise<IProduct> {
        const doc = await ProductsModel.findById(id);
        if (!doc) throw new ApolloError("Producto no encontrado", "NOT_FOUND");
        return doc.toObject();
    }


    async listByAccount(
        accountId: string,
        page = 1,
        limit = 10
    ): Promise<{
        items: IProduct[];
        total: number;
        page: number;
        limit: number;
    }> {
        // Verificar cuenta
        if (!(await AccountsModel.exists({ _id: accountId }))) {
            throw new ApolloError("Cuenta no encontrada", "NOT_FOUND");
        }
        const filter = { accountId };
        const total = await ProductsModel.countDocuments(filter);
        const docs = await ProductsModel.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        return {
            items: docs.map((d) => d.toObject()),
            total,
            page,
            limit,
        };
    }

    /** Compra: valida existencia y stock, descuenta stock */
    async purchase(
        accountId: string,
        productId: string,
        quantity: number
    ): Promise<string> {
        // 1) cuenta
        if (!(await AccountsModel.exists({ _id: accountId }))) {
            throw new ApolloError("Cuenta no encontrada", "NOT_FOUND");
        }
        // 2) producto
        const prod = await ProductsModel.findById(productId);
        if (!prod) throw new ApolloError("Producto no encontrado", "NOT_FOUND");
        // 3) stock
        if (prod.stock < quantity) {
            throw new ApolloError("Stock insuficiente", "BAD_REQUEST");
        }
        // 4) descontar
        prod.stock -= quantity;
        await prod.save();
        return `Compra exitosa: ${quantity} unidad(es) de "${prod.name}"`;
    }
}