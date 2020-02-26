const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const isDev = require('electron-is-dev');
var log = require('electron-log');
const { ipcMain } = require('electron');
const electronLocalshortcut = require('electron-localshortcut');
const jetpack = require('fs-jetpack');
const dialog = electron.dialog;
const { fork } = require('child_process');
// var socket = require('socket.io');
// var io = socket(3002);
// const {NodeVM, VM, VMScript} = require('vm2');
// const Menu = electron.Menu;
// const axios = require('axios');
// const {dialog} = require('electron').remote;
// var remote = require('remote');
// var dialog = remote.require('electron').dialog;

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1300, 
    height: 800, 
    webPreferences: { nodeIntegration: true, webSecurity: false },
    minWidth: 600,
    title: 'UMCS Led Emulator'
  });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools();
  }
  mainWindow.on('closed', () => mainWindow = null);  

  electronLocalshortcut.register(mainWindow, ['Ctrl+R', 'F4'], () => {
    working = false;
    mainWindow.webContents.send('stop');
  });

  electronLocalshortcut.register(mainWindow, ['Ctrl+S'], () => {
    mainWindow.webContents.send('save');
  });

//   var menu = Menu.buildFromTemplate([
//     {
//         label: 'Menu',
//         submenu: [
//             {label:'Adjust Notification Value'},
//             {label:'CoinMarketCap'},
//             {label:'Exit'}
//         ]
//     }
// ])
// Menu.setApplicationMenu(menu); 
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// io.on('connection', (socket) => {
//   log.info('connected..')
//   socket.on('code', (code) => {
//     runCodeVM(code)
//   })
//   socket.on('off', () => {
//     working = false;
//   })
// })

// -------------------------------------------------
// IPC MAIN
ipcMain.on('save', (event, arg) => {
  let path = dialog.showSaveDialog(mainWindow, {
    title: 'Save file - Emulator', 
    buttonLabel: 'Save animation file',
    filters: [
      {name: 'Javascript', extensions: ['js']}
    ]
  });
  jetpack.write(path, arg);
});

ipcMain.on('saveTmp', (event, arg) => {
});

// ipcMain.on('lastEdited', (event, arg) => {
// });

let vmCode = null;

ipcMain.on('code', (event, arg) => {
  runCodeVM(arg);

  vmCode = fork('vm.js');
  vmCode.send({ type: 'RUN', code: code });
  vmCode.on('message', message => {

    switch (message.type) {
      case 'UPDATE':
        mainWindow.webContents.send('UPDATE', message.values);
        break;
      case 'LOG':
        mainWindow.webContents.send('LOG', message.log);
        break;
      case 'ERROR':
        mainWindow.webContents.send('ERROR', message.error);
        break;
    }

    // const outputValues = convert(message);
    // console.log(outputValues);
    // dmx.update(universeName, outputValues);
  })
});

ipcMain.on('off', (event, arg) => {
  if (vmCode !== null) 
    vmCode.kill("SIGKILL");
}); 