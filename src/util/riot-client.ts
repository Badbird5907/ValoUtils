import {RiotClientInfo, TokensResponse} from "@/types/riot-client";

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
