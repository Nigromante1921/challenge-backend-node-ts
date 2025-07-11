import { IResolvers } from "@graphql-tools/utils";
import { ProductService } from "../../services/product.service";

const svc = new ProductService();

const ProductMutations: IResolvers = {
  Mutation: {
    createProduct: (_, { input }) =>
        svc.create(input),

    purchaseProduct: (_, { accountId, productId, quantity }) =>
        svc.purchase(accountId, productId, quantity),
  },
};

export default ProductMutations;