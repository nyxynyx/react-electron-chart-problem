const electron = require("electron");
const app = electron.app;

const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const isDev = require("electron-is-dev");


let mainWindow;

const installExtensions = async () => {
  const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');

  const extensions = [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS];
  for (const extension of extensions) {
    try {
      const name = await installExtension(extension);
      console.log(`Added Extension:  ${name}`);
    } catch (e) {
      console.log('An error occurred: ', err);
    }
  }
}

function createWindow() {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width: Math.round(width * 0.9),
    height: Math.round(height * 0.9),
    webPreferences: {
      nodeIntegration: true,
      preload: __dirname + '/preload.js'
    }
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", async () => {
  createWindow();

  if (isDev) {
    // Install extensions
    await installExtensions();

    // Auto-open dev tools
    mainWindow.webContents.on("did-frame-finish-load", () => {
      mainWindow.webContents.openDevTools({
        mode: 'undocked'
      });
      mainWindow.webContents.once("devtools-opened", () => {
        mainWindow.focus();
      });
    });
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});