import { gql } from "apollo-server-express";

export const schema = gql`
  """
  Paginación de productos
  """
  type ProductPage {
    items: [Product!]!
    total: Int!
    page: Int!
    limit: Int!
  }

  """
  Representa un producto
  """
  type Product {
    _id: ID!
    name: String!
    sku: String!
    stock: Int!
    accountId: ID!
    createdAt: String
    updatedAt: String
  }

  """
  Input para crear un producto
  """
  input CreateProductInput {
    name: String!
    sku: String!
    stock: Int!
    accountId: ID!
  }

  extend type Query {
    # Obtener producto por su ID
    product(id: ID!): Product

    # Listar productos de una cuenta paginados
    productsByAccount(
      accountId: ID!
      page: Int = 1
      limit: Int = 10
    ): ProductPage!
  }

  extend type Mutation {
    # Crea un nuevo producto
    createProduct(input: CreateProductInput!): Product!

    # Simula una compra descontando stock
    purchaseProduct(
      accountId: ID!
      productId: ID!
      quantity: Int!
    ): String!
  }
`;