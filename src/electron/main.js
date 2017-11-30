const { URL } = require('url');
const { app, BrowserWindow } = require('electron');
const environmentService = require('./service/environment.service.js');
const ipcEvents = require('./ipc-events');

function createWindow() {
  return new BrowserWindow({
    width: 800,
    height: 600,
    title: `Inventar ${environmentService.ENVIRONMENT}`,
    x: -800,
    y: 0
  });
}

class Main {
  constructor() {
    this.window = undefined;

    app.on('ready', () => this.onReady());
    app.on('activate', () => this.onActivate());
  }

  onReady() {
    this.window = createWindow();
    this.configureWindow();
  }

  onActivate() {
    if (this.window === null) {
      this.window = createWindow();
      this.configureWindow();
    }
  }

  configureWindow() {
    ipcEvents.setup(this.window);
    this.window.loadURL(new URL(environmentService.APP_URI).toString());
    this.window.webContents.openDevTools();
    this.window.on('closed', () => {
      this.window = null;
    });
  }
}

new Main();
