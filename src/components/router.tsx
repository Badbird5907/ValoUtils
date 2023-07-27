import React, {createContext, Key, useContext, useEffect, useState} from "react";
import {Tab, Tabs} from "@nextui-org/tabs";
import {Route} from "@/types/router";

type RouterProps = {
    routes: Route[];
}
// Create a context to store the routes
const RouterContext = createContext<RouterProps>({ routes: [] });
// Custom hook to use the router context
const useRouter = () => {
    const routerContext = useContext(RouterContext);

    if (!routerContext) {
        throw new Error("useRouter must be used within a RouterProvider");
    }

    const [selected, setSelected] = useState<number>(0);
    const [body, setBody] = useState<React.ReactNode>();

    useEffect(() => {
        setBody(routerContext.routes[selected].component);
    }, [routerContext.routes, selected]);

    const goTo = (id: string) => {
        const routeIndex = routerContext.routes.findIndex((route) => route.id === id);
        if (routeIndex !== -1) {
            console.log(`Going to route with id "${id}"`);
            setSelected(routeIndex);
        } else {
            console.error(`Route with id "${id}" not found.`);
        }
    };

    const goToIndex = (index: number) => { // TODO: figure out why these don't work
        if (index < routerContext.routes.length) {
            console.log(`Going to route with index "${index}"`);
            setSelected(index);
            setBody(routerContext.routes[index].component);
        } else {
            console.error(`Route with index "${index}" not found.`);
        }
    }

    return { selected, body, goTo, goToIndex };
};
const RouterProvider: React.FC<RouterProps & {
    children: React.ReactNode | React.ReactNode[];
}> = ({ routes, children }) => {
    return (
        <RouterContext.Provider value={{ routes }}>
            {children}
        </RouterContext.Provider>
    );
};

const Router = () => {
    const { routes } = useContext(RouterContext);
    const { selected, body, goTo } = useRouter();

    return (
        <>
            <div className="flex w-full flex-col px-4">
                <Tabs
                    aria-label="Options"
                    color="primary"
                    variant="underlined"
                    classNames={{
                        tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                        cursor: "w-full bg-[#22d3ee]",
                        tab: "max-w-fit px-0 h-12",
                        tabContent: "group-data-[selected=true]:text-[#06b6d4]",
                    }}
                    selected={selected} // Use selected directly to set initial tab selection
                    onSelectionChange={(key: Key) => {
                        goTo(routes[key as number].id); // Use the goTo function to change the selected tab
                    }}
                >
                    {routes.map((route, index) => (
                        <Tab
                            key={index}
                            title={
                                <div className="flex items-center space-x-2">
                                    {route.icon}
                                    <span>{route.title}</span>
                                </div>
                            }
                        />
                    ))}
                </Tabs>
            </div>
            {body}
        </>
    );
};

export { Router, RouterProvider, useRouter };