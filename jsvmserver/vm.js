
// VM
const {NodeVM} = require('vm2');

let working = false;

function NextFrame(dmxValues) {
    // io.emit('update', dmxValues)
    process.send(dmxValues);
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

process.on('message', message => {

    if(message.type === 'STOP') {
        // working = false;
        process.exit(1);
    }
    else {
        runCodeVM(message.code);
    }
    // process.send(message);
});
  
// process.on('end', message => {
//     working = false;
// });