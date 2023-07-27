import {RiotClientInfo, TokensResponse} from "@/types/riot-client";
import {SettingsResponse} from "@/types/settings.ts";

export const getInfo = async () => {
  return new Promise<RiotClientInfo>((resolve, reject) => {
    if (window.Main) {
      const listener = (message: string) => {
        console.log(message);
        const data: RiotClientInfo = JSON.parse(message);
        console.log(data);
        resolve(data);
        window.Main.removeAllListeners("client_info:get");
      }
      window.Main.on("client_info:get", listener);
      window.Main.send("client_info:get");
    } else {
      reject("window.Main is not defined");
    }
  });
}

export const getTokens = async () => {
  return new Promise<TokensResponse>((resolve, reject) => {
    if (window.Main) {
      const listener = (message: string) => {
        const data: TokensResponse = JSON.parse(message);
        console.log(data);
        resolve(data);
        window.Main.removeListener("tokens:get", listener);
      }
      window.Main.on("tokens:get", listener);
      window.Main.send("tokens:get");
    } else {
      reject("window.Main is not defined");
    }
  })
}

export const getSettings = async () => {
  return new Promise<SettingsResponse>((resolve, reject) => {
    if (window.Main) {
      const listener = (message: string) => {
        const data: SettingsResponse = JSON.parse(message);
        console.log(data);
        resolve(data);
        window.Main.removeListener("settings:get", listener);
      }
      window.Main.on("settings:get", listener);
      window.Main.send("settings:get");
    } else {
      reject("window.Main is not defined");
    }
  })
}
