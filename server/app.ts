import express from "express";
import { v4 as uuid } from "uuid";
import bodyParser from "body-parser";
import cors from "cors";
import { startApolloServer } from "./graphql";
import config from "./config/app";
import { logger } from "./config/logger";

const app = express();

app.use((req, _res, next) => {
    const requestId = uuid();

    ;(req as any).log = logger.child({ requestId, path: req.path });
    next();
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

startApolloServer(app, {
    context: ({ req }: { req: any }) => ({
        logger: (req as any).log
    })
});

app.set("port", config.server.port);


app.listen(app.get("port"), () => {
    logger.info(
        { port: app.get("port") },
        "Server running and GraphQL endpoint ready"
    );
});
