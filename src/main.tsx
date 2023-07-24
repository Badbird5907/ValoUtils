import React from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import App from "./App";
import { DynamicModalProvider } from "./components/dynamic-modal";
import Router from "@/components/router";
import { FaBook, FaCog, FaFlask, FaHome } from "react-icons/fa";
import IPCTest from "@/IPCTest";
import { SWRConfig } from "swr";
import { fetcher } from "@/util/swr";

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <NextUIProvider>
      <SWRConfig value={{
        fetcher,
        refreshInterval: 10000
      }}>
        <DynamicModalProvider>
          <div className="flex flex-col h-screen bg-gray-800">
            <Router routes={[
              {
                title: "Home",
                icon: <FaHome/>,
                component: <App />
              },
              {
                title: "Testing",
                icon: <FaFlask/>,
                component: <IPCTest/>
              }
            ]} />
          </div>
        </DynamicModalProvider>
      </SWRConfig>
    </NextUIProvider>
  </React.StrictMode>
);
