import { join } from "path";

import { app, BrowserWindow, ipcMain, IpcMainEvent, nativeTheme } from "electron";
import isDev from "electron-is-dev";
import { getAccessToken, getRiotClientInfo } from "./util/riot-client";
import { getEntitlementsToken } from "./util/riot/entitlements";

const height = 800;
const width = 800;

function createWindow() {
  // Create the browser window.
  const window = new BrowserWindow({
    width,
    height,
    frame: true,
    show: true,
    resizable: true,
    fullscreenable: true,
    webPreferences: {
      preload: join(__dirname, "preload.js")
    }
  });
  window.setMenu(null);
  nativeTheme.themeSource = "dark";

  const port = process.env.PORT || 3000;
  const url = isDev ? `http://localhost:${port}` : join(__dirname, "../src/out/index.html");

  // and load the index.html of the app.
  if (isDev) {
    window?.loadURL(url);
  } else {
    window?.loadFile(url);
  }
  // Open the DevTools.
  // window.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on("riot_client_info", async (event: IpcMainEvent) => {
  console.log("riot_client_info");
  event.sender.send("riot_client_info", JSON.stringify(await getRiotClientInfo()));
});

ipcMain.on("access_token:get", async (event: IpcMainEvent) => {
  console.log("access_token:get");
  event.sender.send("access_token:get", JSON.stringify(await getAccessToken()));
});

ipcMain.on("access_token:refresh", async (event: IpcMainEvent) => {
  event.sender.send("access_token:refresh", JSON.stringify(await getAccessToken(true)));
});

ipcMain.on("entitlements_token:get", async (event: IpcMainEvent) => {
  event.sender.send("entitlements_token:get", JSON.stringify(await getEntitlementsToken()));
});