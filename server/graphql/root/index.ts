import { gql } from "apollo-server-express";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";

import {
  accountSchema,
  accountResolvers,
  accountMutations,
} from "../accounts";
import {
  productSchema,
  productResolvers,
  productMutations,
} from "../products";

// Paso 1: definimos los tipos raíz vacíos
const rootTypeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

// Paso 2: merge de todos los typeDefs (incluyendo ese root vacío).
export const typeDefs = mergeTypeDefs([
  rootTypeDefs,
  accountSchema,
  productSchema,
]);

// Paso 3: merge de todos los resolvers
export const resolvers = mergeResolvers([
  accountResolvers,
  accountMutations,
  productResolvers,
  productMutations,
]);