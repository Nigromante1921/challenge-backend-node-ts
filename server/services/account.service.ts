import { AccountsModel } from "../models/accounts";
import { IAccount } from "../interfaces/account";
import { ApolloError } from "apollo-server-errors";
import { logger } from '../config/logger';

export class AccountService {

    async create(input: Pick<IAccount, "name" | "email">): Promise<IAccount> {

        try {
            const doc = await AccountsModel.create(input);
            logger.debug({ id: doc._id }, 'Account persisted');
            return doc.toObject();
        } catch (err: any) {
            logger.error({ err, input }, "Error creating account");
            if (err.code === 11000) {
                throw new ApolloError("El email ya existe", "BAD_USER_INPUT");
            }
            throw err;
        }
    }


    async getById(id: string): Promise<IAccount> {
        logger.info({ accountId: id }, "AccountService.getById called");
        const doc = await AccountsModel.findById(id);
        if (!doc) {
            logger.warn({ accountId: id }, "Account not found");
            throw new ApolloError("Cuenta no encontrada", "NOT_FOUND");
        }
        const result = doc.toObject();
        logger.debug({ account: result }, "Account fetched");
        return result;
    }


    async list(
        name?: string,
        page = 1,
        limit = 10
    ): Promise<{ items: IAccount[]; total: number; page: number; limit: number }> {
        logger.info({ filter: name ?? null, page, limit }, "AccountService.list called");
        const filter: any = {};
        if (name) filter.name = new RegExp(name, "i");

        const total = await AccountsModel.countDocuments(filter);
        const docs = await AccountsModel.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        const items = docs.map((d) => d.toObject());
        logger.debug({ returned: items.length, total }, "Accounts listed");
        return { items, total, page, limit };
    }
}