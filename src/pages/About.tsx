import CustomButton from "@/components/button.tsx";
import {openUrl} from "@/util";
import {FaDiscord, FaGithub} from "react-icons/fa6";

const About = () => {
    return (
        <>
            <h1 className={"text-4xl font-bold text-center mt-4"}>ValoUtils</h1>
            <h1 className={"text-2xl font-bold text-center mt-4"}>Made by <button onClick={() => {
                openUrl("https://github.com/Badbird5907");
            }}>Badbird5907</button></h1>
            <CustomButton className={"mx-4 mt-4"} onPress={() => {
                openUrl("https://github.com/Badbird5907/ValoUtils");
            }}>
                <FaGithub/> Github
            </CustomButton>
            <CustomButton className={"mx-4 mt-4"} onPress={() => {
                openUrl("https://github.com/Badbird5907/ValoUtils");
            }}>
                <FaDiscord/>Discord
            </CustomButton>
        </>
    );
};

export default About;