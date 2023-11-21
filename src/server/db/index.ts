import { env } from "~/env.mjs";
import { XataClient } from "./xata";

export const xata = new XataClient({
  apiKey: env.XATA_API_KEY,
  branch: env.XATA_BRANCH,
});

export * from "./xata";
