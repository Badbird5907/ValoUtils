import React, {Key, useEffect} from "react";
import { Tab, Tabs } from "@nextui-org/tabs";
import { Route } from "@/types/router";

type RouterProps = {
  routes: Route[];
}
const Router = ({ routes }: RouterProps) => {
  const [selected, setSelected] = React.useState<number>(0);
  const [body, setBody] = React.useState<React.ReactNode>(routes[0].component);
  useEffect(() => {
    setBody(routes[selected].component);
  }, [selected])
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
            tabContent: "group-data-[selected=true]:text-[#06b6d4]"
          }}
          onSelectionChange={(key: Key) => {
            setSelected(key as number);
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

export default Router;