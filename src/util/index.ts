export function openUrl(url: string) {
    if (window.Main) window.Main.send("open_url", url);
    else window.open(url)
}