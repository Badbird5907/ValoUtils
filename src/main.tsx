import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/App.tsx'
import './index.css'
import {NextUIProvider} from "@nextui-org/react";
import {DynamicModalProvider} from "./components/dynamic-modal";
import {Router, RouterProvider} from "@/components/router";
import {FaCogs, FaFlask, FaHome} from "react-icons/fa";
import IPCTest from "@/pages/IPCTest.tsx";
import {SWRConfig} from "swr";
import {fetcher} from "@/util/swr";
import RiotClientWatcher from "@/components/riot-client-watcher.tsx";
import SettingsProfiles from "@/pages/SettingsProfiles.tsx";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <NextUIProvider>
            <SWRConfig value={{
                fetcher,
                refreshInterval: 10000
            }}>
                <DynamicModalProvider>
                    <RouterProvider routes={[
                        {
                            title: "Home",
                            id: "home",
                            icon: <FaHome/>,
                            component: <App/>
                        },
                        {
                            title: "Testing",
                            id: "testing",
                            icon: <FaFlask/>,
                            component: <IPCTest/>
                        },
                        {
                            title: "Profiles",
                            id: "profiles",
                            icon: <FaCogs/>,
                            component: <SettingsProfiles/>
                        }
                    ]}>

                        <RiotClientWatcher>
                            <div className="flex flex-col h-screen bg-black overflow-x-hidden">
                                <Router />
                            </div>
                        </RiotClientWatcher>
                    </RouterProvider>
                </DynamicModalProvider>
            </SWRConfig>
        </NextUIProvider>
    </React.StrictMode>
)

postMessage({payload: 'removeLoading'}, '*')
