import { gql } from 'apollo-server-express';

export const schema = gql`
    type Partner {
        id: ID!
        name: String!
        email: String
    }

    extend type Query {
        findPartnerByEmail(email: String!): [Partner!]!
        findPartnerByName(name: String!):  [Partner!]!
    }

    input PartnerInput {
        name: String!
        email: String
    }

    extend type Mutation {
        createPartner(input: PartnerInput!): ID!
        updatePartner(id: ID!, input: PartnerInput!): Boolean!
    }
`;
