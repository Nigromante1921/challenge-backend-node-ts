import { IResolvers } from "@graphql-tools/utils";
import { AccountService } from "../../services/account.service";

const svc = new AccountService();

const AccountQueries: IResolvers = {
  Query: {
    account: async (_, { id }) => svc.getById(id),
    accounts: async (_, { name, page, limit }) =>
        svc.list(name, page, limit),
  },
};

export default AccountQueries;
