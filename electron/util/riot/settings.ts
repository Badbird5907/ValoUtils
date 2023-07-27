import axios from "axios";
import {getTokens} from "../riot-client.ts";
import {SettingsResponse} from "@/types/settings.ts";
import {Profile} from "@/types/profile.ts";

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
export const loadSettings = async (profile: Profile) => {
    console.log(`Loading profile ${profile.name}`);
    const token = await getTokens();
    // PUT https://playerpreferences.riotgames.com/playerPref/v3/savePreference
    const response = await axios.put("https://playerpreferences.riotgames.com/playerPref/v3/savePreference", {
        type: "Ares.PlayerSettings",
        data: profile.data
    }, {
        headers: {
            Authorization: `Bearer ${token.accessToken}`,
            "X-Riot-Entitlements-JWT": token.token,
        }
    });
    console.log(response.data);
    return response.data as SettingsResponse;
}
