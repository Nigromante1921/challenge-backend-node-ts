import mongoose from "mongoose";
import { logger } from "../config/logger";
import config from "../config/app";

const {
  dbnorel: { accounts, products },
} = config;


const makeNewConnection = (name: string, uri: string) => {
  const db = mongoose.createConnection(uri);

  db.on("error", (error) => {
    logger.error({ error, db: name }, `MongoDB connection error: ${name}`);
    db.close().catch((err) =>
        logger.info({ err, db: name }, `Failed to close connection: ${name}`)
    );
  });

  db.on("connected", () =>
      logger.info({ db: name }, `Connected to MongoDB: ${name}`)
  );

  db.on("disconnected", () =>
      logger.warn({ db: name }, `Disconnected from MongoDB: ${name}`)
  );

  return db;
};

const cnxAccounts = makeNewConnection("eiAccounts", accounts.uri);
const cnxProducts = makeNewConnection("eiProducts", products.uri);

export { cnxAccounts, cnxProducts };
