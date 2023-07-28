import CustomButton from "@/components/button.tsx";
import {openUrl} from "@/util";
import {FaDiscord, FaGithub, FaTwitter} from "react-icons/fa6";
import {useEffect, useState} from "react";
import useSWR from "swr";

const About = () => {
    const [version, setVersion] = useState<string | null>("Loading...");
    useEffect(() => {
        if (window.Main) {
            window.Main.on("version", (version: string) => {
                setVersion(version);
            });
            window.Main.send("version");
            return () => {
                window.Main.removeAllListeners("version");
            }
        }
    }, []);

    // these endpoints don't exist yet, but i'm keeping this in the first release so when they do go live, it'll show up on older versions
    const announcementData = useSWR("https://apps.badbird.dev/api/valoutils/announcements");
    /*
        {
            title: "Announcement",
            message: "Some message"
        }
    */
    const versionData = useSWR(`https://apps.badbird.dev/api/valoutils/version?version=${version}`);
    return (
        <>
            <h1 className={"text-4xl font-bold text-center mt-4"}>ValoUtils</h1>
            <h1 className={"text-2xl font-bold text-center mt-4"}>Made by <button onClick={() => {
                openUrl("https://github.com/Badbird5907");
            }}>Badbird5907</button></h1>
            <h1 className={"text-xl font-bold text-center mt-4"}>Version {version}</h1>

            {!versionData.isLoading && !versionData.error && versionData && (
                <div className={"flex flex-col gap-2 mt-4"}>
                    <h1 className={"text-xl font-bold text-center"}>{versionData.data.title}</h1>
                    <span className={"text-center"}>{versionData.data.message}</span>
                </div>
            )}

            {!announcementData.isLoading && !announcementData.error && announcementData.data && (
                <div className={"flex flex-col gap-2 mt-4"}>
                    <h1 className={"text-xl font-bold text-center"}>{announcementData.data.title}</h1>
                    <span className={"text-center"}>{announcementData.data.message}</span>
                </div>
            )}

            <CustomButton className={"mx-4 mt-4"} onPress={() => {
                openUrl("https://github.com/Badbird5907/ValoUtils");
            }}>
                <FaGithub/> Github
            </CustomButton>
            <CustomButton className={"mx-4 mt-4"} onPress={() => {
                openUrl("https://twitter.com/Badbird_5907/");
            }}>
                <FaTwitter/> Twitter
            </CustomButton>
            <CustomButton className={"mx-4 mt-4"} onPress={() => {
                openUrl("https://github.com/Badbird5907/ValoUtils");
            }}>
                <FaDiscord/> Discord
            </CustomButton>
            <CustomButton className={"mx-4 mt-4"} onPress={() => {
                window.Main.send("update:check")
            }}>
                Check for updates
            </CustomButton>
        </>
    );
};

export default About;