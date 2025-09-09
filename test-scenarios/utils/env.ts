import * as dotenv from "dotenv";
import path from "path";

//dotenv.config({ path: '../.config/.env' });
dotenv.config({ path: path.resolve(__dirname, "../.config/.env") });

export const CPURL = process.env.CPURL || "";
export const CPPSWD = process.env.CPPSWD || "";
export const CPUSERPSWD = process.env.CPUSERPSWD || "";
export const CPUSER = process.env.CPUSER || "";
export const CPSA = process.env.CPSA || "";
export const CPUSERINCORRECT = process.env.CPUSERINCORRECT || "";
export const CPPSWDINCORRECT = process.env.CPPSWDINCORRECT || "";
