import { IResolvers } from "@graphql-tools/utils";
import { ProductService } from "../../services/product.service";

const svc = new ProductService();

const ProductMutations: IResolvers = {
  Mutation: {

    createProduct: async (_parent, { input }, { logger }) => {
      logger.info({ input }, "createProduct called");
      const product = await svc.create(input);
      logger.info({ productId: "id" }, "Product created");
      return product;
    },

    purchaseProduct: async (_parent, { accountId, productId, quantity }, { logger }) => {
      logger.info({ accountId, productId, quantity }, "purchaseProduct called");
      const message = await svc.purchase(accountId, productId, quantity);
      logger.info({ accountId, productId, quantity, message }, "purchaseProduct result");
      return message;
    },
  },
};

export default ProductMutations;