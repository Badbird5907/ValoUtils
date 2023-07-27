const getClipboard = async () => {
    return new Promise<string>((resolve) => {
        window.Main.on("clipboard:get", (data: string) => {
            const { text } = JSON.parse(data);
            resolve(text);
        })
        window.Main.send("clipboard:get");
    });
}
export default getClipboard;