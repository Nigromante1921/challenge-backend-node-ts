import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { makeExecutableSchema } from "@graphql-tools/schema";

import { typeDefs, resolvers } from "./root";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

/**
 * Inicializa ApolloServer sobre una instancia de Express.
 * Recibe opcionalmente un context para inyectar logger o variables.
 */
async function startApolloServer(
    app: any,
    options?: { context?: ({ req }: { req: any }) => any }
) {
  const apolloServer = new ApolloServer({
    schema,
    csrfPrevention: true,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    context: options?.context,
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: "/graphql" });
}

export { startApolloServer };