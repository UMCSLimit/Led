const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const path = require('path');
const isDev = require('electron-is-dev');
var socket = require('socket.io');
// var io = socket(3002);
var log = require('electron-log');
const {NodeVM, VM, VMScript} = require('vm2');
const { ipcMain } = require('electron');
const electronLocalshortcut = require('electron-localshortcut');
const jetpack = require('fs-jetpack');
const axios = require('axios');
// const {dialog} = require('electron').remote;
// var remote = require('remote');
// var dialog = remote.require('electron').dialog;
const dialog = electron.dialog;

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
    // console.log('You pressed ctrl & R or F4');
    working = false;
    mainWindow.webContents.send('stop');
  });

  electronLocalshortcut.register(mainWindow, ['Ctrl+S'], () => {
    // console.log('You pressed ctrl & R or F4');
    // working = false;
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

let globalRemoveDmxValue = 0;

function removeDmx(dmxValues) {

  let tmp = dmxValues;

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 28; j++) {
      tmp[i][j][0] -= globalRemoveDmxValue;
      tmp[i][j][1] -= globalRemoveDmxValue;
      tmp[i][j][2] -= globalRemoveDmxValue;
      
      if (tmp[i][j][0] < 0) tmp[i][j][0] = 0;
      if (tmp[i][j][1] < 0) tmp[i][j][1] = 0;
      if (tmp[i][j][2] < 0) tmp[i][j][2] = 0;
    }
  }

  return tmp;
}

// Socket.io functions with VM2
function NextFrame(dmxValues) {

  // let tmp = removeDmx(dmxValues);

  // io.emit('update', dmxValues)
  mainWindow.webContents.send('update', dmxValues);
}

function GetKinect() {
  let mousePos = electron.screen.getCursorScreenPoint();
  return mousePos;
}

let working = false;

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
  // io.emit('my_error', err);
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
    // io.emit('log', data);
    mainWindow.webContents.send('log', data);
  })

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
      vm.run(code, 'vm.js')
  }
  catch(error) {
    // io.emit('my_error', error.message );
    mainWindow.webContents.send('error', error.message);
  }
}

// io.on('connection', (socket) => {
//   log.info('connected..')
//   socket.on('code', (code) => {
//     runCodeVM(code)
//   })
//   socket.on('off', () => {
//     working = false;
//   })
// })

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

ipcMain.on('code', (event, arg) => {
  runCodeVM(arg)
});

ipcMain.on('off', (event, arg) => {
  working = false;
});

globalRemoveDmxValue = 30;

// ----- QUEUE -----

// Main queue logic
// 1. get top from queue
// 2. run code async 
// 3. add timeout forexample 5s () => { working=false }
// 4. after timeout, get next in queue and repeat from 1.
// 5. if length < 3, get code from backend and push to queue

// additional
// - queue has max limit
// - only one animation for each user
// - fading code that takes one sec to fade out
// - if limit is reached send back request about failure
// - two timeouts, where one starts fading out all, second fades in 

class MainQueue {
  constructor(sendQueue) {
    this.id = 0;
    this.countRandom = -1;
    this.queue = [];
    this.minQueueLength = 3;
    this.sendQueue = sendQueue;
    this.url = `http://localhost:3005/Led/animations/random`;
    // this.push({ name: 'First' })
    // Start by getting a random animation
    this.randomCode();
    // this.push(this.randomCode());
    // this.start();
  }

  start() {
    
    // Getting next item
    const nextItem = this.next();
    // Filling up to minQueueLength by random animations
    if( this.queue.length < this.minQueueLength) { // while
      log.info('Queue length smaller than 3, adding new code');
      // this.push(this.randomCode());
      this.randomCode();
    }

    console.log(nextItem);

    // let code = this.randomCode(); 
    const code = nextItem.code;
    log.info(`Playing code: ${nextItem.name}`);
    
    // Send Queue !
    this.sendQueue({ playing: nextItem,queue: this.queue });

    log.info(code);

    // Run animation using code
    runCodeVM(code);
    // this.logAll();
    // Stop code in code.time milliseconds
    setTimeout(() => {
      log.info(`Stopping code after ${nextItem.time} milliseconds`);      
      // We stop the loop here by setting working to false
      // We can stop code by killing the process in the future
      working = false;
      // We wait y milliseconds for the code to stop
      setTimeout(() => {
        log.info(`Waited 100 milliseconds for playing new code`);
        // We can Repeat the proccess here
        this.start();
      }, 100);
    }, nextItem.time);
  }

  apiCall() {
    axios.get(this.url)
      .then(data => {
        // console.log(data.data);

        this.push(data.data);

        // data.data.forEach((element) => {
        //   // console.log(element);
        //   let o = Object.assign({}, element, { time: 10000 });
        //   // console.log(o);
        //   this.push(o);
        // })
      })
      .catch(err => {
        console.log(err);
      })
  }

  axios() {
    return axios.get(this.url);
  }

  randomCode() {
    this.apiCall();
    return;

    this.countRandom++;
    if(this.countRandom % 3 === 0)
      return {
        id: this.id,
        name: 'first animation',
        code: `async function loop() {
          // Your code goes here
          for(let i = 0; i < 5; i++) {
              for(let j= 0; j < 28; j++) {
                  values[i][j][0] = 255;
                  await sleep(46);
                  NextFrame();
              }
          }
        }`,
        time: 10000
      }
    else if(this.countRandom % 3 === 1)
      return {
        id: this.id,
        name: 'second animation',
        code: `function removeAll () {
          for (let i = 0; i < 5; i++) {
              for (let j = 0; j < 28; j++){
                  
                  values[i][j][0] -= 3;
                  values[i][j][1] -= 3;
                  values[i][j][2] -= 3;
                  
                  if (values[i][j][0] < 0) values[i][j][0] = 0;
                  if (values[i][j][1] < 0) values[i][j][1] = 0;
                  if (values[i][j][2] < 0) values[i][j][2] = 0;
              }
          }
      }
      
      async function loop() {
        // Your code goes here
        
        let kinect = GetKinect();
        
        // [ 0, 1 ]
        let x = kinect.x / 1980;
        let y = kinect.y / 1000;
        
        x *= 28;
        y *= 5;
        
        x = parseInt(x);
        y = parseInt(y);
        
        removeAll();
        
        
        
        for(let i = 0; i < 5; i++) {
          // 	values[i][x][0] += 30;
          // 	values[i][x][1] += 30;
            values[i][x][2] += 30;
        }
        
      // 	removeAll();
        
        await sleep(46);
        NextFrame();
      }`,
        time: 10000
      }
    else 
    {
      return {
        id: this.id,
        name: 'third animation',
        code: `async function loop() {
          // Your code goes here
          for(let i = 0; i < 5; i++) {
              for(let j= 0; j < 28; j++) {
                  values[i][j][2] = 255;
                  await sleep(46);
                  NextFrame();
              }
          }
        }`,
        time: 10000
      }
    }
  }

  push(item) {
    this.queue.push(item);
    // this.sendQueue(this.queue);
    this.id += 1;
  }

  next() {
    return this.queue.shift();
  }

  getAll() {
    return this.queue;
  }

  logAll() {
    this.queue.forEach((item) => {
      console.log(item);
    })
  }

  // Sending whole queue
  // start signal
  // stop signal
  // send data when:
  // - new animation is added to queue by user
  // - new animation is added when randomed from backend
  // each animation in queue has unique id

  // sendQueue() {
  //   log.info('Sending queue to front end');
  //   mainWindow.webContents.send('queue', this.queue);
  //   // After each operation on queue, send whole thing on front
  //   // Send Push
  //   // Send Pop
  //   // Send whole queue for checking for errors ( with ids ) 
  // }
}
// ----- End Queue -----

sendQueue = (queue) => {
  if (mainWindow != null)
    mainWindow.webContents.send('queue', queue);
}

// let mainQueue = new MainQueue(sendQueue);
// mainQueue.start();

// setTimeout(() => {
//   mainQueue.axios()
//     .then(data => {
//       data.data.forEach((element) => {
//         // console.log(element);
//         let code = element.code;
//         // code = code.replace('\t', ' ');
//         // code = code.replace('\n', ' ');
//         // code = `function removeAll () {     for (let i = 0; i < 5; i++) {         for (let j = 0; j < 28; j++){                          values[i][j][0] -= 3;             values[i][j][1] -= 3;             values[i][j][2] -= 3;                          if (values[i][j][0] < 0) values[i][j][0] = 0;             if (values[i][j][1] < 0) values[i][j][1] = 0;             if (values[i][j][2] < 0) values[i][j][2] = 0;         }     } }  async function loop() { 	// Your code goes here 	 	let kinect = GetKinect(); 	 	// [ 0, 1 ] 	let x = kinect.x / 1980; 	let y = kinect.y / 1000; 	 	x *= 28; 	y *= 5; 	 	x = parseInt(x); 	y = parseInt(y); 	 	removeAll(); 	 	 	 	for(let i = 0; i < 5; i++) {     // 	values[i][x][0] += 30;      	values[i][x][1] += 30;     //	values[i][x][2] += 30; 	} 	 // 	removeAll(); 	 	await sleep(46); 	NextFrame(); }`
//         let o = Object.assign({}, element, { time: 10000, code: code });
//         console.log(o);
//         mainQueue.push(o);
//       })
//       mainQueue.start();
//     })
//     .catch(err => {
//       console.log(err);
//     })
// }, 5000)


// ----- Queue tests -----
// setTimeout(() => {
//   log.info('Adding new code after 6s to queue');
//   mainQueue.push(mainQueue.randomCode());
//   mainQueue.logAll();
// }, 6000);

// setTimeout(() => {
//   log.info('Adding 10 new codes after 16s to queue');
//   for(let i = 0; i < 10; i++)
//     mainQueue.push(mainQueue.randomCode());
//   mainQueue.logAll();
// }, 16000);
// ----- End Queue tests -----