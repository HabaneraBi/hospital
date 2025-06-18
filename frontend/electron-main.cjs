const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    icon: path.join(__dirname, "icon.png"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Для разработки (Vite dev server)
  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:3000");
  } else {
    // Для продакшена (собранный Vite build)
    win.loadFile(path.join(__dirname, "dist/index.html"));
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
