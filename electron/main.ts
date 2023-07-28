import {app, shell, BrowserWindow, clipboard, ipcMain, IpcMainEvent} from 'electron'
import path from 'node:path'
import {getRiotClientInfo, getTokens, getUserInfo} from "./util/riot-client.ts";
import {initSettingsIpc} from "./modules/profiles";
import { autoUpdater } from "electron-updater"
import { initialize, trackEvent } from "@aptabase/electron/main";
import Store from "./util/store.ts";

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

initialize("A-US-1888737338");

let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

const height = 800;
const width = 900;

const config = new Store({
    configName: 'config',
    defaults: {
        openDevTools: false,
        autoUpdate: true,
    }
})

function createWindow() {
    win = new BrowserWindow({
        width,
        height,
        frame: true,
        show: true,
        resizable: true,
        fullscreenable: true,
        icon: path.join(process.env.PUBLIC, 'icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    })
    win.setMenu(null);
    if (config.get("openDevTools")) win.webContents.openDevTools();
    win.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url)
        return { action: 'deny' }
    })

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL)
    } else {
        // win.loadFile('dist/index.html')
        win.loadFile(path.join(process.env.DIST, 'index.html'))
    }
}
const checkUpdate = async () => {
    if (config.get("autoUpdate")) {
        await autoUpdater.checkForUpdatesAndNotify();
    }
}
autoUpdater.on('checking-for-update', () => {
    console.log("Checking for updates...");
    win?.webContents.send("update:checking");
    win?.webContents.send("alert:info", "Checking for updates...");
})
autoUpdater.on('update-available', (info) => {
    console.log("Update available, downloading...");
    win?.webContents.send("update:available", JSON.stringify(info));
    win?.webContents.send("alert:info", "Update available, downloading...");
    trackEvent("update_downloading");
})

autoUpdater.on('update-not-available', (info) => {
    console.log("Update not available");
    win?.webContents.send("update:not-available", JSON.stringify(info));
    win?.webContents.send("alert:info", "No updates available.");
})
autoUpdater.on('error', (err) => {
    console.error("Error while updating: ", err);
    win?.webContents.send("update:error", err);
})
autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    console.log(log_message);
    win?.webContents.send("update:download-progress", progressObj);
})
autoUpdater.on('update-downloaded', (info) => {
    console.log("Update downloaded");
    win?.webContents.send("update:downloaded", JSON.stringify(info));
    win?.webContents.send("alert:info", "Successfully downloaded update. Restarting...");
    autoUpdater.quitAndInstall(true, true);
});

app.on('window-all-closed', () => {
    win = null
    app.quit(); // SUPER IMPORTANT I HAD 100 PROCESSES RUNNING IN THE BACKGROUND LOL
})

app.on('ready', async () => {
    await checkUpdate();
});
app.whenReady().then(createWindow)

ipcMain.on("open_url", (_: IpcMainEvent, url: string) => {
    console.log("Opening URL in browser: ", url);
    trackEvent("open_url", {url: url});
    shell.openExternal(url);
});

ipcMain.on("version", (event: IpcMainEvent) => {
    const version = app.getVersion();
    event.sender.send("version", version);
});

ipcMain.on("client_info:get", async (event: IpcMainEvent) => {
    event.sender.send("client_info:get", JSON.stringify(await getRiotClientInfo()));
});

ipcMain.on("tokens:get", async (event: IpcMainEvent) => {
    event.sender.send("tokens:get", JSON.stringify(await getTokens()));
});

ipcMain.on("tokens:refresh", async (event: IpcMainEvent) => {
    event.sender.send("tokens:refresh", JSON.stringify(await getTokens(true)));
});

ipcMain.on("clipboard:get", async (event: IpcMainEvent) => {
    event.sender.send("clipboard:get", JSON.stringify({
        text: clipboard.readText(),
    }));
});

ipcMain.on("analytics:track", async (_: IpcMainEvent, event: string, data: string) => {
    trackEvent(event, JSON.parse(data));
});

ipcMain.on("update:check", async () => {
    await checkUpdate();
});

initSettingsIpc();
let firstDisconnect = false;
setInterval(async () => {
    try {
        await getUserInfo();
    } catch (error) {
        if (firstDisconnect) {
            trackEvent("riot_client_disconnect", {error: (error as any).toString()});
            firstDisconnect = true;
        }
        win?.webContents.send("riot_client:disconnect", (error as any).toString());
    }
}, 5000)
if (config.get("autoUpdate")) {
    setInterval(async () => {
        try {
            await checkUpdate();
        } catch (error) {
            console.error("Error while checking for updates: ", error);
        }
    }, 1000 * 60 * 60) // auto check for updates every hour
}