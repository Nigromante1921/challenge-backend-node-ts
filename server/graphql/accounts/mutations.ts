import { IResolvers } from "@graphql-tools/utils";
import { AccountService } from "../../services/account.service";

const svc = new AccountService();

const AccountMutations: IResolvers = {
  Mutation: {
    createAccount: async (_parent, { input }, { logger }) => {
      logger.info({ input }, 'createAccount called');
      const account = await svc.create(input);
      logger.info({ accountId: "id" }, 'Account created');
      return account;
    },
  },
};

export default AccountMutations;