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


// VM
const {NodeVM} = require('vm2');

let working = false;
let global_remove_values = 255;

function limited_subb (a, b) {
  a -= b;
  if ( a < 0 ) a = 0;
  return a;
}

function limited_add (a, b) {
  a += b;
  if (a > 255) a = 255;
  return a;
}

function remove_global(value) {
  global_remove_values = limited_subb(global_remove_values, value);
}

function add_global(value) {
  global_remove_values = limited_add(global_remove_values, value);
}

let kinectValues = {x: 0, y: 0};

function NextFrame(dmxValuesIn) {
  // let dmxValues = dmxValuesIn.slice();
  // for(let i = 0; i < 5; i++) {
  //   for(let j = 0; j < 28; j++) {
  //     let dmxRow = dmxValues[i][j].slice();
  //     dmxRow[0] = limited_subb(dmxRow[0], global_remove_values);
  //     dmxRow[1] = limited_subb(dmxRow[1], global_remove_values);
  //     dmxRow[2] = limited_subb(dmxRow[2], global_remove_values);
  //     dmxValues[i][j] = dmxRow;
  //   }
  // }

  mainWindow.webContents.send('update', dmxValuesIn);  

  // process.send({type: 'UPDATE', values: dmxValuesIn});
}

function GetKinect() {
  let mousePos = electron.screen.getCursorScreenPoint();
  return mousePos;
  // return {x: 800, y: 100};
  // return kinectValues;
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
    process.send({type: 'ERROR', error: err});
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
    // process.send({type: 'LOG', log: data});
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
    // process.send({type: 'ERROR', error: error.message});

  }
}

// function fadeIn(time) {
//   const fadeInInterval = setInterval(() => {
//     remove_global(15);
//   }, 46);

//   setTimeout(() => {
//     clearInterval(fadeInInterval);
//   }, 1500);
// }

// function fadeOut(time) {
//   const fadeOutInterval = setInterval(() => {
//     add_global(15);
//   }, 46);

//   setTimeout(() => {
//     clearInterval(fadeOutInterval);
//   }, 1500);  
// }

// process.on('message', message => {
//   switch(message.type) {
//     case 'FADE_IN':
//       break;
//     case 'FADE_OUT':
//       fadeOut(1000);
//       break;
//     case 'KINECT':
//       kinectValues.x = message.x;
//       kinectValues.y = message.y;
//     case 'RUN':
//       working = true;
//       // fadeIn(1000);
//       runCodeVM(message.code);
//       break;
//     case 'STOP':
//       process.exit(1);
//   }
// });

// let vmCode = null;

ipcMain.on('code', (event, arg) => {
  runCodeVM(arg);

  // vmCode = fork('public/vm.js');
  // vmCode.send({ type: 'RUN', code: arg });
  // vmCode.on('message', message => {    
  //   switch (message.type) {
  //     case 'UPDATE':
  //       mainWindow.webContents.send('update', message.values);
  //       break;
  //       case 'LOG':
  //         mainWindow.webContents.send('log', message.log);
  //         break;
  //         case 'ERROR':
  //           mainWindow.webContents.send('error', message.error);
  //       break;
  //     }

      // REDIS !!!
      
      // let mousePos = electron.screen.getCursorScreenPoint();
  // return mousePos;
      // vmCode.send({type: 'KINECT', x: mousePos.x, y:mousePos.y});
      // const outputValues = convert(message);
    // console.log(outputValues);
    // dmx.update(universeName, outputValues);
  // })
});

ipcMain.on('off', (event, arg) => {
  working = false;
  // if (vmCode !== null) 
  //   vmCode.kill("SIGKILL");
}); 