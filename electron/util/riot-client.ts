import fs from "fs";
import axios, {Method} from "axios";
import {RiotClientInfo, TokensResponse} from "../../src/types/riot-client";
import {httpsAgent} from "../../src/util/axios";

// Caching variables
let cachedRiotClientInfo: RiotClientInfo | null = null;
let lastModified: number | null = null;
export const getRiotClientInfo = async (): Promise<RiotClientInfo> => {
    try {
        // Check if the client information is already cached and the lockfile was not modified
        if (cachedRiotClientInfo && lastModified !== null) {
            const lockfilePath = `${process.env.LOCALAPPDATA}\\Riot Games\\Riot Client\\Config\\lockfile`;
            const currentLastModified = (await fs.promises.stat(lockfilePath)).mtimeMs;
            if (currentLastModified === lastModified) {
                return cachedRiotClientInfo;
            }
        }

        // open %localappdata%\Riot Games\Riot Client\Config\lockfile
        const lockfilePath = `${process.env.LOCALAPPDATA}\\Riot Games\\Riot Client\\Config\\lockfile`;
        const lockfileContent = await fs.promises.readFile(lockfilePath, "utf-8");
        const [name, pid, port, password, protocol] = lockfileContent.split(":");

        // Update the cached values
        cachedRiotClientInfo = {
            name,
            pid: parseInt(pid),
            port: parseInt(port),
            password,
            protocol
        };
        lastModified = (await fs.promises.stat(lockfilePath)).mtimeMs;

        return cachedRiotClientInfo;
    } catch (error) {
        throw new Error("Failed to read Riot Client lockfile: " + error);
    }
};


const getUrl = async (): Promise<string> => {
    const info = await getRiotClientInfo();
    return `${info.protocol}://127.0.0.1:${info.port}`;
};

const sendInternalRequest = async (path: string, method: Method | string, body?: any): Promise<any> => {
    // use axios to send a request to the riot client
    const url = await getUrl();
    const info = await getRiotClientInfo();
    const authorization = Buffer.from(`riot:${info.password}`).toString("base64");
    const finalUrl = `${url}${path}`;
    const response = await axios.create({
        httpsAgent: httpsAgent
    }).request({
        url: finalUrl,
        method,
        headers: {
            Authorization: `Basic ${authorization}`
        },
        ...(body ? {data: body} : {})
    });
    return response.data;
};


let cachedAccessToken: TokensResponse | null = null;
let cachedTime: number | null = null;

export const getTokens = async (skipCache = false): Promise<TokensResponse> => {
    if (!skipCache && cachedTime && cachedAccessToken && Date.now() < cachedTime + 5 * 60 * 1000) { // TODO either use the expire time from /rso-auth/v1/authorization/access-token or figure something else out
        return cachedAccessToken;
    }
    const newAccessToken = await sendInternalRequest("/entitlements/v1/token", "GET");
    cachedAccessToken = newAccessToken;
    cachedTime = Date.now();
    return newAccessToken;
};
