/*
import axios from "axios";
import { getAccessToken } from "../riot-client";

// Create an in-memory cache object
const cache: any = {};

export const getEntitlementsToken = async (accessToken = "", skipCache = false): Promise<string> => {
  let token = accessToken;

  if (!skipCache && !accessToken) {
    token = (await getAccessToken(skipCache)).token;
  }

  // Check if the token is already cached
  if (cache[token]) {
    return cache[token];
  }

  const response = await axios.post(
    "https://entitlements.auth.riotgames.com/api/token/v1",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // Cache the result before returning
  cache[token] = response.data.entitlements_token;

  return response.data.entitlements_token;
};
 */
