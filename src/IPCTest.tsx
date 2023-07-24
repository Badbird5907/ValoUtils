import React, { useEffect } from "react";
import CustomButton from "@/components/button";

function IPCTest() {
  const [data, setData] = React.useState<string>("");
  const [sent, setSent] = React.useState<boolean>(false);
  useEffect(() => {
    if (window.Main) {
      window.Main.on("message", (message: string) => {
        console.log(message);
        setData(message);
        setSent(false);
      });
    }
  }, []);
  return (
    <>
      <h1 className={"text-4xl font-bold text-center mt-4"}>Hello World</h1>
      <CustomButton onPress={() => {
        if (window.Main) {
          window.Main.sendMessage("Testing");
          setSent(true);
        }
      }} isLoading={sent}>
        Send
      </CustomButton>
      {data && (
        <span>
          {data}
        </span>
      )}
    </>
  );
}

export default IPCTest;
