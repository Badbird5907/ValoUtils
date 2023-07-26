import {app, BrowserWindow, ipcMain, IpcMainEvent} from 'electron'
import path from 'node:path'
import {getRiotClientInfo, getTokens, getUserInfo} from "./util/riot-client.ts";
import {getPreferences} from "./util/riot/settings.ts";

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


let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

const height = 800;
const width = 800;

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

    // Test active push message to Renderer-process.
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', (new Date).toLocaleString())
    })

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL)
    } else {
        // win.loadFile('dist/index.html')
        win.loadFile(path.join(process.env.DIST, 'index.html'))
    }
}

app.on('window-all-closed', () => {
    win = null
})

app.whenReady().then(createWindow)


ipcMain.on("client_info:get", async (event: IpcMainEvent) => {
    event.sender.send("client_info:get", JSON.stringify(await getRiotClientInfo()));
});

ipcMain.on("tokens:get", async (event: IpcMainEvent) => {
    event.sender.send("tokens:get", JSON.stringify(await getTokens()));
});

ipcMain.on("tokens:refresh", async (event: IpcMainEvent) => {
    event.sender.send("tokens:refresh", JSON.stringify(await getTokens(true)));
});

ipcMain.on("settings:get", async (event: IpcMainEvent) => {
    event.sender.send("settings:get", JSON.stringify(await getPreferences()));
});

// spin up a thread that will poll for the client info
setInterval(async () => {
    try {
        await getUserInfo();
    } catch (error) {
        win?.webContents.send("riot_client:disconnect", (error as any).toString());
    }
}, 5000)