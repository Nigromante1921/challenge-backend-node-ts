import { Schema, Document } from "mongoose";
import { IAccount } from "../interfaces/account";
import { cnxAccounts } from "../db/mongodb";

interface AccountDoc extends IAccount, Document {}

const accountsSchema = new Schema<AccountDoc>(
    {
        name:  { type: String, required: true },
        email: { type: String, required: true, unique: true }
    },
    {
        timestamps: true,
        collection: "accounts"
    }
);


accountsSchema.index({ email: 1 }, { unique: true });

export const AccountsModel = cnxAccounts.model<AccountDoc>(
    "Account",
    accountsSchema
);
