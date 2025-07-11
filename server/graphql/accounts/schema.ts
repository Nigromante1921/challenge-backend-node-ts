import { gql } from "apollo-server-express";

export const schema = gql`
  
  
  type AccountPage {
    items: [Account!]!
    total: Int!
    page: Int!
    limit: Int!
  }

  type Account {
    _id: ID!
    name: String!
    email: String!
    createdAt: String
    updatedAt: String
  }

  input CreateAccountInput {
    name: String!
    email: String!
  }

  extend type Query {
    
    account(id: ID!): Account
    accounts(name: String, page: Int = 1, limit: Int = 10): AccountPage!
    
  }

  extend type Mutation {
    createAccount(input: CreateAccountInput!): Account!
  }
  
`;
