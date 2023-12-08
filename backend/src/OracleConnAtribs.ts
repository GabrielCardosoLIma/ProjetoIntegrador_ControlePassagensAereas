import ora, { ConnectionAttributes } from "oracledb";
import dotenv from "dotenv";

dotenv.config();

export const oraConnAttribs: ConnectionAttributes = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectionString: process.env.ORACLE_CONNECTIONSTRING,
};
