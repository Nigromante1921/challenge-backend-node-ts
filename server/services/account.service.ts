import { AccountsModel } from "../models/accounts";
import { IAccount } from "../interfaces/account";
import { ApolloError } from "apollo-server-errors";

export class AccountService {

    async create(input: Pick<IAccount, "name" | "email">): Promise<IAccount> {
        try {
            const doc = await AccountsModel.create(input);
            return doc.toObject();
        } catch (err: any) {
            if (err.code === 11000) {
                throw new ApolloError("El email ya existe", "BAD_USER_INPUT");
            }
            throw err;
        }
    }


    async getById(id: string): Promise<IAccount> {
        const doc = await AccountsModel.findById(id);
        if (!doc) throw new ApolloError("Cuenta no encontrada", "NOT_FOUND");
        return doc.toObject();
    }


    async list(
        name?: string,
        page = 1,
        limit = 10
    ): Promise<{
        items: IAccount[];
        total: number;
        page: number;
        limit: number;
    }> {
        const filter: any = {};
        if (name) filter.name = new RegExp(name, "i");

        const total = await AccountsModel.countDocuments(filter);
        const docs = await AccountsModel.find(filter)
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
}