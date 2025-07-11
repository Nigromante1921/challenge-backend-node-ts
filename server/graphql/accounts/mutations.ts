import { IResolvers } from "@graphql-tools/utils";
import { AccountService } from "../../services/account.service";

const svc = new AccountService();

const AccountMutations: IResolvers = {
  Mutation: {
    createAccount: async (_, { input }) => svc.create(input),
  },
};

export default AccountMutations;