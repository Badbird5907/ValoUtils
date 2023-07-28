import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {NextUIProvider} from "@nextui-org/react";
import {DynamicModalProvider} from "./components/dynamic-modal";
import {Router, RouterProvider} from "@/components/router";
import {FaCogs} from "react-icons/fa";
import {SWRConfig} from "swr";
import {fetcher} from "@/util/swr";
import RiotClientWatcher from "@/components/riot-client-watcher.tsx";
import SettingsProfiles from "@/pages/SettingsProfiles.tsx";
import {FaQuestion} from "react-icons/fa6";
import About from "@/pages/About.tsx";
import SnackbarProvider from "react-simple-snackbar";
import AlertContainer from "@/components/alert-container.tsx";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <NextUIProvider>
            <SWRConfig value={{
                fetcher,
                refreshInterval: 10000
            }}>
                <DynamicModalProvider>
                    <SnackbarProvider>
                        <AlertContainer>
                            <RouterProvider routes={[
                                /*
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
                                 */
                                {
                                    title: "Profiles",
                                    id: "profiles",
                                    icon: <FaCogs/>,
                                    component: <SettingsProfiles/>
                                },
                                {
                                    title: "About",
                                    id: "about",
                                    icon: <FaQuestion/>,
                                    component: <About/>
                                }
                            ]}>
                                <RiotClientWatcher>
                                    <div className="flex flex-col h-screen bg-black overflow-x-hidden">
                                        <Router/>
                                    </div>
                                </RiotClientWatcher>
                            </RouterProvider>
                        </AlertContainer>
                    </SnackbarProvider>
                </DynamicModalProvider>
            </SWRConfig>
        </NextUIProvider>
    </React.StrictMode>
)

postMessage({payload: 'removeLoading'}, '*')
