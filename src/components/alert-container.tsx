import {useEffect} from "react";
import { useSnackbar } from "react-simple-snackbar";

type AlertContainerProps = {
    children: React.ReactNode | React.ReactNode[];
}
const AlertContainer = (props: AlertContainerProps) => {
    const [openSnackbar] = useSnackbar()
    useEffect(() => {
        if (window.Main) {
            window.Main.on("alert:info", (message: string) => {
                openSnackbar(message);
            });
        }
    }, [])
    return (
        <>
            {props.children}
        </>
    );
};

export default AlertContainer;