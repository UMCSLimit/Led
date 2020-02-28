// VM
const {NodeVM} = require('vm2');

let working = false;
let global_remove_values = 255;

const redis = require('redis');
const client = redis.createClient({
  port: 6379,
  host: '127.0.0.1',
  password: ''
})

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

function NextFrame(dmxValuesIn) {

  client.set('dmx', JSON.stringify(dmxValuesIn));
  // io.emit('update', dmxValues)
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
  // process.send(dmxValues);
}

function GetKinect() {
  // let mousePos = electron.screen.getCursorScreenPoint();
  // return mousePos;
  return [300, 400];
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
  io.emit('my_error', err);
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
    // console.log(data);
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
    // io.emit('my_error', error.message );
  }
}

function fadeIn(time) {
  const fadeInInterval = setInterval(() => {
    remove_global(15);
  }, 46);

  setTimeout(() => {
    clearInterval(fadeInInterval);
  }, 1500);
}

function fadeOut(time) {
  const fadeOutInterval = setInterval(() => {
    add_global(15);
  }, 46);

  setTimeout(() => {
    clearInterval(fadeOutInterval);
  }, 1500);  
}

process.on('message', message => {
  switch(message.type) {
    case 'FADE_IN':
      break;
    case 'FADE_OUT':
      fadeOut(1000);
      break;
    case 'RUN':
      working = true;
      fadeIn(1000);
      runCodeVM(message.code);
      break;
    case 'STOP':
      working = false;
      process.exit(1);
      break;
  }
});