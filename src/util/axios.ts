import * as https from "https";

export const httpsAgent = new https.Agent({ rejectUnauthorized: false });
