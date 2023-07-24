import React from "react";
import CustomButton from "@/components/button";

function App() {
  return (
    <>
      <h1 className={"text-4xl font-bold text-center mt-4"}>Hello World 1</h1>
      <CustomButton onPress={() => {
        if (window.Main) {
          window.Main.send("riot_client_info", "dummy");
        }
      }}>
        Send
      </CustomButton>
    </>
  );
}

export default App;
