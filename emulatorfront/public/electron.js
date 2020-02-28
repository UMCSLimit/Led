const electron = require('electron');
const app = electron.app;
const dialog = electron.dialog;
const BrowserWindow = electron.BrowserWindow;
const isDev = require('electron-is-dev');
const electronLocalshortcut = require('electron-localshortcut');
var log = require('electron-log');
const path = require('path');
const { ipcMain } = require('electron');
const jetpack = require('fs-jetpack');
const { NodeVM } = require('vm2');
var _ = require('lodash');
// const Menu = electron.Menu;
// var socket = require('socket.io');
// var io = socket(3002);

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
  if (path !== '' && path !== undefined) {
    jetpack.write(path, arg);
  } else {
    log.info('No path has been selected');
  }
});

// ipcMain.on('lastEdited', (event, arg) => {
// });

ipcMain.on('code', (event, arg) => {
  runCodeVM(arg);
});

ipcMain.on('off', (event, arg) => {
  working = false;
  mainWindow.webContents.send('stop');
}); 

// -------------------------------------------------
// NODEVM
let working = false;

function ConvertToDMX(values) {
  let dmxValues = {};
  let id = 0;
  for(let i = 4; i >= 0; i--) {
    for(let j = 27; j >= 0; j--, id += 3) {
      dmxValues[id] = values[i][j][0];
      dmxValues[id+1] = values[i][j][1];
      dmxValues[id+2] = values[i][j][2];
    }
  }
  return dmxValues;
}

function NextFrame(values) {
  mainWindow.webContents.send('update', values);
  // console.log(ConvertToDMX(values));
}

function GetKinect() {
  let mousePos = electron.screen.getCursorScreenPoint();
  return mousePos;
}

function ifWorking() {
  return working;
}

function initValues() {
  let values = [];
  for (let i = 0; i < 5; i++) {
      let tmp = []
      for (let j = 0; j < 28; j++) {
          tmp.push([0, 0, 0]);
      }
      values.push(tmp);
  }
  return values;
}

function getError(err) {
  mainWindow.webContents.send('error', err);  
}

function initNodeVM() {
  let vm = new NodeVM({
    timeout: 4000,
    sandbox: {
      _ifWorking: () => ifWorking(),
      _NextFrame: (dmxValues) => NextFrame(dmxValues),
      GetKinect: () => GetKinect(),
      _initValues: () => initValues(),
      _getError: (err) => getError(err),  
    },
    require: {
      external: true
    },
    console: 'redirect'
   });
   return vm;
}

function runCodeVM(code) {
  const vm = initNodeVM();
  vm.on('console.log', (data) => {
    mainWindow.webContents.send('log', data);  
  });

  working = true;

  code = `let values = _initValues(); function NextFrame() { if(_ifWorking() === false) throw 'Stop'; _NextFrame(values);} function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms));} ` + 
    code + ' ' +
    ` async function _loop() {
      while(true){
        await loop()
        if(_ifWorking() === false) break; 
      }
    } 
    _loop()
      .catch(err => {
        if(err !== 'Stop') _getError(err.message);
      })
    ` 
    
  try {
    vm.run(code, '_vm.js')
  }
  catch(error) {
    mainWindow.webContents.send('error', error.message);  
  }
}