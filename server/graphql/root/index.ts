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

import {
  odooSchema, odooResolvers, odooMutations
} from '../odoo';


const rootTypeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;


export const typeDefs = mergeTypeDefs([
  rootTypeDefs,
  accountSchema,
  productSchema,
  odooSchema,
]);


export const resolvers = mergeResolvers([
  accountResolvers,
  accountMutations,
  productResolvers,
  productMutations,
  odooResolvers,
  odooMutations,
]);