import React, { useEffect } from "react";
import CustomButton from "@/components/button";
import { useDynamicModal } from "@/components/dynamic-modal";
import { Button as NextUIButton } from "@nextui-org/button";

function IPCTest() {
  const { showModal, closeModal } = useDynamicModal();
  const [sent, setSent] = React.useState<boolean>(false);
  useEffect(() => {
    console.log("IPCTest mounted");
    if (window.Main) {
      window.Main.on("riot_client_info", (message: string) => {
        console.log(message);
        showModal({
          title: "Message",
          body: message,
          footer: (
            <NextUIButton
              color={"danger"}
              onPress={closeModal}
            >
              Close
            </NextUIButton>
          )
        });
        setSent(false);
      });
      return () => {
        console.log("IPCTest unmounted");
        window.Main.removeAllListeners("riot_client_info");
      }
    }
  }, []);
  return (
    <>
      <h1 className={"text-4xl font-bold text-center mt-4"}>Hello World</h1>
      <CustomButton onPress={() => {
        if (window.Main) {
          window.Main.send("riot_client_info", "dummy");
          setSent(true);
        }
      }} isLoading={sent}>
        Send
      </CustomButton>
    </>
  );
}

export default IPCTest;
