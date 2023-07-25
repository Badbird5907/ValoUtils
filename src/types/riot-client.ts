export type RiotClientInfo = {
  name: string;
  pid: number;
  port: number;
  password: string;
  protocol: string;
}

export type AccessToken = {
  expiry: number;
  scopes: string[];
  token: string;
}