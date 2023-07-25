import { AccessToken, RiotClientInfo } from "@/types/riot-client";

export const getInfo = async () => {
  return new Promise<RiotClientInfo>((resolve, reject) => {
    if (window.Main) {
      const listener = (message: string) => {
        console.log(message);
        const data: RiotClientInfo = JSON.parse(message);
        console.log(data);
        resolve(data);
        window.Main.removeAllListeners("riot_client_info");
      }
      window.Main.on("riot_client_info", listener);
      window.Main.send("riot_client_info");
    } else {
      reject("window.Main is not defined");
    }
  });
}

export const getAccessToken = async () => {
  return new Promise<AccessToken>((resolve, reject) => {
    if (window.Main) {
      const listener = (message: string) => {
        const data: AccessToken = JSON.parse(message);
        console.log(data);
        resolve(data);
        window.Main.removeListener("access_token:get", listener);
      }
      window.Main.on("access_token:get", listener);
      window.Main.send("access_token:get");
    } else {
      reject("window.Main is not defined");
    }
  })
}

export const getEntitlementsToken = async () => {
  return new Promise<string>((resolve, reject) => {
    if (window.Main) {
      const listener = (message: string) => {
        const data: string = JSON.parse(message);
        console.log(data);
        resolve(data);
        window.Main.removeListener("entitlements_token:get", listener);
      }
      window.Main.on("entitlements_token:get", listener);
      window.Main.send("entitlements_token:get");
    } else {
      reject("window.Main is not defined");
    }
  })
}