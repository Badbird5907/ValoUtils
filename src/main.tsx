import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {NextUIProvider} from "@nextui-org/react";
import {DynamicModalProvider} from "./components/dynamic-modal";
import Router from "@/components/router";
import {FaFlask, FaHome} from "react-icons/fa";
import IPCTest from "@/IPCTest";
import {SWRConfig} from "swr";
import {fetcher} from "@/util/swr";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <NextUIProvider>
            <SWRConfig value={{
                fetcher,
                refreshInterval: 10000
            }}>
                <DynamicModalProvider>
                    <div className="flex flex-col h-screen bg-gray-800 overflow-x-hidden">
                        <Router routes={[
                            {
                                title: "Home",
                                icon: <FaHome/>,
                                component: <App/>
                            },
                            {
                                title: "Testing",
                                icon: <FaFlask/>,
                                component: <IPCTest/>
                            }
                        ]}/>
                    </div>
                </DynamicModalProvider>
            </SWRConfig>
        </NextUIProvider>
    </React.StrictMode>
)

postMessage({payload: 'removeLoading'}, '*')
