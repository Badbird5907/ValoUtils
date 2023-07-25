import React from "react";
import CustomButton from "@/components/button";
import { getAccessToken, getEntitlementsToken, getInfo } from "@/util/riot-client";
import { AccessToken, RiotClientInfo } from "@/types/riot-client";

function App() {
  const [data, setData] = React.useState<RiotClientInfo | null>(null)
  const [accessToken, setAccessToken] = React.useState<AccessToken | null>(null)
  const [entitlementsToken, setEntitlementsToken] = React.useState<string | null>(null)
  const [time, setTime] = React.useState<number>(0)
  return (
    <>
      <h1 className={"text-4xl font-bold text-center mt-4"}>Hello World 1</h1>
      <CustomButton onClickLoading={() => {
        const start = Date.now();
        return getInfo().then((data) => {
          const ms = Date.now() - start;
          setTime(ms);
          setData(data);
        }).catch((err) => {
          console.error(err);
        });
      }}>
        Get Info
      </CustomButton>
      {data && (
        <div>
          <p>Name: {data.name}</p>
          <p>Process ID: {data.pid}</p>
          <p>Port: {data.port}</p>
          <p>Password: {data.password}</p>
          <p>Protocol: {data.protocol}</p>
          <p>Took: {time}ms</p>
        </div>
        )}
      <CustomButton onClickLoading={() => {
        const start = Date.now();
        return getAccessToken().then((data) => {
          const ms = Date.now() - start;
          setTime(ms);
          setAccessToken(data);
        }).catch((err) => {
          console.error(err);
        });
      }} className={"my-4"}>
        Get Access Token
      </CustomButton>
      {accessToken && (
        <div>
          <p>Access Token: {accessToken.token}</p>
          <p>Scopes: {accessToken.scopes}</p>
          <p>Expire: {accessToken.expiry}</p>
          <p>Took: {time}ms</p>
        </div>
      )}
      <CustomButton onClickLoading={() => {
        const start = Date.now();
        return getEntitlementsToken().then((data) => {
          const ms = Date.now() - start;
          setTime(ms);
          setEntitlementsToken(data);
        }).catch((err) => {
          console.error(err);
        });
      }}>
        Get Entitlements Token
      </CustomButton>
      {entitlementsToken && (
        <div>
          <p>Entitlements Token: {entitlementsToken}</p>
          <p>Took: {time}ms</p>
        </div>
      )}
    </>
  );
}

export default App;
