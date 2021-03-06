// import express (after npm install express)
const express = require('express');
const socket = require('socket.io');
// const {NodeVM} = require('vm2');
const axios = require('axios');
const io = socket(3002);

// DMX
const DMX = require('dmx');
const dmx = new DMX();
const universeName = 'main';

const noDev = true;
let devType = 'null';
let devName = '';
if (!noDev) {
  devType = 'enttec-open-usb-dmx';
  devName = '/dev/ttyUSB0';
}
// let universe = dmx.addUniverse(universeName, devType, devName);

// const process = require('process');
const { fork } = require('child_process');

// create new express app and save it as "app"
const app = express();

// server configuration
const PORT = 8080;

// create a route for the app
app.get('/', (req, res) => {
  res.send('Hello World');
});

// make the server listen to requests
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});

const redis = require('redis');
const client = redis.createClient({
  port: 6379,
  host: '127.0.0.1',
  password: ''
})

const vmCode = fork('vm.js');
vmCode.send({ type: 'RUN', code: `async function loop() { for(let i = 0; i < 28; i++){for(let j = 0; j < 5; j++){values[j][i][1] = 255;values[j][i][0] = 255;values[j][i][2] = 255;await sleep(100); NextFrame();}} }` });

const nextFrameInterval = setInterval(() => {
  // console.log(123);
  client.get('dmx', (err, reply) => {
    console.log(reply);
  })
}, 100);

// Socket end points

// user
// - push (add new animation to queue) 
// - update
// - error ( show only local / save to database )
// - console ( only local )
// - queue

io.on('connection', (socket) => {
  console.log('connected..')
  socket.on('code', (code) => {
    // runCodeVM(code)
  });
  socket.on('off', () => {
    // working = false;
  });
});


function convert(values) {
  let dmxValues = {};
  let id = 0;
  for(let i = 5; i >= 0; i--) {
    for(let j = 28; j >= 0; j--) {
      dmxValues[id] = values[i][j];
      id++;
    }
  }
  return dmxValues;
}


// Queue 
class MainQueue {
  constructor(sendQueue) {
    this.queue = [];
    this.minQueueLength = 3;
    this.sendQueue = sendQueue;
    this.url = `http://localhost:3005/Led/animations/random`;
  }

  start() {
    axios.get(this.url)
      .then(resp => {
        this.push(resp.data);
        this.loop();
      })
      .catch(err => {
        // console.log(err);
        console.log('Error at start, retrying in 5 sec..');
        setTimeout(() => {
          this.start();
        }, 5000);
      })
  }

  loop() {
    // Getting next item
    // Sprwadzic czy undediended
    const nextItem = this.next();

    // Filling up to minQueueLength by random animations
    if( this.queue.length < this.minQueueLength) { // while
      console.log('Queue length smaller than 3, adding new code');
      const addToQueueCount = this.minQueueLength - this.queue.length;

      for(let i = 0; i < addToQueueCount; i++) {
        this.randomCode();
      }
    }

    if (nextItem === null) {
      console.log('Error, nextItem is null, retrying in 5 sec..');
      setTimeout(() => {
        this.loop();
      }, 5000);
    }

    const code = nextItem.code;
    console.log(`Playing code: ${nextItem.name}`);
    
    // Send Queue !
    this.sendQueue({ playing: nextItem,queue: this.queue });

    // Run animation using code

    // runCodeVM(code);
    const vmCode = fork('vm.js');

    vmCode.send({ type: 'RUN', code: code });

    // const nextFrameInterval = setInterval(() => {
    //   console.log(123);
    //   client.get('dmx', (err, reply) => {
    //     console.log(reply);
    //   })
    // }, 46);

    // vmCode.on('message', message => {
      // console.log(message);
      // Nie mamy dostepu do socketa tutaj
      // io.emit('update', message);

      // const outputValues = convert(message);
      // console.log(outputValues);
      // dmx.update(universeName, outputValues);
    // })

    const codeTime = 5000;

    // Stop code in code.time milliseconds
    setTimeout(() => {
      console.log(`Stopping code after ${nextItem.time} milliseconds`);      
      // We stop the loop here by setting working to false
      // We can stop code by killing the process in the future
      // working = false;
      
      vmCode.send({type: 'FADE_OUT'});
      // vmCode.kill("SIGKILL");

      // We wait y milliseconds for the code to stop
      setTimeout(() => {
        
        clearInterval(nextFrameInterval);

        vmCode.kill("SIGKILL");
        console.log(`Waited 1000 milliseconds for playing new code`);
        // We repeat the proccess here
        this.loop();
      }, 1000);
    }, codeTime); // nextItem.time
  }

  apiCall() {
    axios.get(this.url)
      .then(data => {
        this.push(data.data);
      })
      .catch(err => {
        console.log('Error apiCall');
        // console.log(err);
      })
  }

  randomCode() {
    this.apiCall();
    return;
  }

  push(item) {
    this.queue.push(item);
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
}

sendQueue = (queue) => {
  io.emit('queue', queue);
}

// ----- QUEUE -----
// additional
// - queue has max limit
// - only one animation for each user
// - if limit is reached send back request about failure
// - each animation in queue has unique id
// send data when:
// - new animation is added to queue by user
// - new animation is added when randomed from backend
// ----- End Queue -----

// const mainQueue = new MainQueue(sendQueue);
// mainQueue.start();