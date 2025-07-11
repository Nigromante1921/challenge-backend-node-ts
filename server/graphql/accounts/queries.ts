import { IResolvers } from "@graphql-tools/utils";
import { AccountService } from "../../services/account.service";

const svc = new AccountService();

const AccountQueries: IResolvers = {
  Query: {

    account: async (_parent, { id }, { logger }) => {
      logger.info({ accountId: id }, 'Fetching account by ID');
      const result = await svc.getById(id);
      logger.info({ account: result }, 'Fetched account');
      return result;
    },

    accounts: async (_parent, { name, page, limit }, { logger }) => {
      logger.info({ filter: name ?? null, page, limit }, 'Listing accounts');
      const result = await svc.list(name, page, limit);
      logger.info(
          { page: result.page, returned: result.items.length, total: result.total },
          'Accounts listed'
      );
      return result;
    },
  },
};

export default AccountQueries;
