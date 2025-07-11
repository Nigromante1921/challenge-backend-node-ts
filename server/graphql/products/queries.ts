import { IResolvers } from "@graphql-tools/utils";
import { ProductService } from "../../services/product.service";

const svc = new ProductService();

const ProductQueries: IResolvers = {
  Query: {
    product: (_, { id }) =>
        svc.getById(id),

    productsByAccount: (_, { accountId, page, limit }) =>
        svc.listByAccount(accountId, page, limit),
  },
};

export default ProductQueries;