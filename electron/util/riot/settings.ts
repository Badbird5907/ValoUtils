import axios from "axios";
import {getTokens} from "../riot-client.ts";
import {SettingsResponse} from "@/types/settings.ts";

export const getPreferences = async () => {
    const token = await getTokens();
    const response = await axios.get("https://playerpreferences.riotgames.com/playerPref/v3/getPreference/Ares.PlayerSettings", {
        headers: {
            Authorization: `Bearer ${token.accessToken}`,
            "X-Riot-Entitlements-JWT": token.token,
        }
    });
    return response.data as SettingsResponse;
}