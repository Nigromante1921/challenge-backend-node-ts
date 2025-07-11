import { IResolvers } from "@graphql-tools/utils";
import { ProductService } from "../../services/product.service";

const svc = new ProductService();

const ProductQueries: IResolvers = {
  Query: {

    product: async (_parent, { id }, { logger }) => {
      logger.info({ productId: id }, "Fetching product by ID");
      const result = await svc.getById(id);
      logger.info({ product: result }, "Fetched product");
      return result;
    },


    productsByAccount: async (
        _parent,
        { accountId, page, limit },
        { logger }
    ) => {
      logger.info(
          { accountId, page, limit },
          "Listing products for account"
      );
      const result = await svc.listByAccount(accountId, page, limit);
      logger.info(
          {
            accountId,
            returned: result.items.length,
            total: result.total,
            page: result.page,
          },
          "Products listed"
      );
      return result;
    },
  },
};

export default ProductQueries;