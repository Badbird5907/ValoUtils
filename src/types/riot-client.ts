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


export type UserInfoResponse = {
    acct: {
        game_name: string;
        tag_line: string;
    },
    country: string;
    email_verified: boolean;
    lol: {
        cpid: string;
        ploc: string;
    },
    lol_account: null;
    phone_number_verified: boolean;
    player_plocale: null;
    preferred_username: string;
}