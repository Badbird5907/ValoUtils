import React from "react";
import CustomButton from "@/components/button.tsx";
import {getInfo, getSettings, getTokens} from "@/util/riot-client.ts";
import {RiotClientInfo, TokensResponse} from "@/types/riot-client.ts";
import {SettingsResponse} from "@/types/settings.ts";

function App() {
    const [data, setData] = React.useState<RiotClientInfo | null>(null)
    const [accessToken, setAccessToken] = React.useState<TokensResponse | null>(null)
    const [time, setTime] = React.useState<number>(0)
    const [settingsData, setSettingsData] = React.useState<SettingsResponse | null>(null)
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
                return getTokens().then((data) => {
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
                    <p>Access Token: {accessToken.accessToken}</p>
                    <p>Entitlements: {accessToken.token}</p>
                    <p>Took: {time}ms</p>
                </div>
            )}
            <CustomButton onClickLoading={() => {
                const start = Date.now();
                return getSettings().then((data) => {
                    const ms = Date.now() - start;
                    setTime(ms);
                    setSettingsData(data);
                }).catch((err) => {
                    console.error(err);
                });
            }}>
                Get Settings
            </CustomButton>
            {settingsData && (
                <div>
                    <p>Settings: {JSON.stringify(settingsData)}</p>
                    <p>Took: {time}ms</p>
                </div>
            )}
        </>
    );
}

export default App;
