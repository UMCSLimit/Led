const {NodeVM} = require('vm2');

function NextFrame(dmxValues) {
    console.log(dmxValues);
    // MUSZE WYSLAC POZA VM'KE
}

function getKinect() {
    return {x: 1, y: 20}
}

const vm = new NodeVM({
    sandbox: {
        NextFrame: (dmxValues) => NextFrame(dmxValues),
        getKinect: () => getKinect()
    },
    require: {
        external: true
    }
});

try {
    vm.run(`
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async function demo() {
        dmxValues = {1: 0, 2: 0}
        while(true)
        {
            dmxValues['1'] += 1;
            dmxValues['1'] %= 255;
    
            NextFrame(dmxValues);
            // let kinect = getKinect();
            // console.log(kinect.x)
            await sleep(dmxValues['1']);
        }
    }
    demo();
    `);
    
} catch (error) {
    console.log(error)
}

console.log('123');