export type RiotClientInfo = {
  name: string;
  pid: number;
  port: number;
  password: string;
  protocol: string;
}

export type TokensResponse = {
  /** Used as the token in requests */
  accessToken: string;
  entitlements: unknown[];
  issuer: string;
  /** Player UUID */
  subject: string;
  /** Used as the entitlement in requests */
  token: string; // entitlement token
};