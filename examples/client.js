var socket = require('socket.io-client')('http://localhost:5000');

socket.on('connect', function(){ 
    console.log('connected');   
    socket.emit('my_event', 'hello');
});
socket.on('my_response', function(data){
    console.log(data);
})
socket.on('event', function(data){});
socket.on('disconnect', function(){});

var stdin = process.stdin;
stdin.setRawMode( true );
stdin.resume();
stdin.setEncoding( 'utf8' );
stdin.on( 'data', function( key ){
  if(key == 'a') {
      socket.emit('my_event', 'a')
  }
  if ( key === '\u0003' ) {
    process.stdout.write( '\nexiting\n' );
    process.exit();
  }
});


// main_server (Django) -> dmx
//  - js_vm_worker (node) -> socket to main_server
//  - py_vm_worker (python)-> socket to main_server
//  - apka -> komendy po socket
//  - apka_Szymona (admin, token) -> (UDP teraz, przerabiamy na socketio) nadpisuje wszystkie wartości 
//  

// sockety
// /js
// /js_dmx
// /py
// /py_dmx

// [ 0, 255, 0, 120, 230, ..., n]
// [ R1,G1 B1, R2, ... ] 
//  n = 384