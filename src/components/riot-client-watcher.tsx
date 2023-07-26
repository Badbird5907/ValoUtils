import React, {useEffect} from "react";
import {useDynamicModal} from "@/components/dynamic-modal.tsx";
import {Button as NextUIButton} from "@nextui-org/button";

interface RiotClientWatcherProps {
    children?: React.ReactNode | React.ReactNode[];
}
const RiotClientWatcher = ({ children }: RiotClientWatcherProps) => {
    const { showModal, closeModal } = useDynamicModal();
    useEffect(() => {
        if (window.Main) {
            window.Main.on("riot_client:disconnect", (message: string) => {
                console.log(message);
                showModal({
                    title: "Riot Client Disconnected!",
                    body: <div className={"flex flex-col"}>
                        <span>Riot client couldn't be reached! Please check if the game is running.</span>
                        <span className={"py-4"}>If the game is running, please restart it.</span>
                        <span>{message}</span>
                    </div>,
                    footer: (
                        <NextUIButton
                            color={"danger"}
                            onPress={closeModal}
                        >
                            Close
                        </NextUIButton>
                    )
                });
            });
            return () => {
                window.Main.removeAllListeners("riot_client:disconnect");
            }
        }
    }, []);
    return (
        <>
            {children}
        </>
    );
};

export default RiotClientWatcher;