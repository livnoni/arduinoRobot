var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var car;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', async function(socket){
    console.log('a user connected');

    if(!car) car = await require('./arduino')();

    var state = "";

    socket.on('robot', function(msg){
        console.log('robot: ' + msg);
        switch(msg) {
            case 'FORWARD':
                //Arrow up
                if(state != "FORWARD"){
                    console.log("FORWARD");
                    state = "FORWARD";
                    car.forward();
                }
                break;
            case 'BACKWARD':
                //Arrow down
                if(state != "BACKWARD"){
                    console.log("down");
                    state = "BACKWARD";
                    car.backward();
                }
                break;
            case 'RIGHT':
                //Arrow right
                if(state != "RIGHT"){
                    console.log("right");
                    state = "RIGHT";
                    car.right();
                }
                break;
            case 'LEFT':
                //Arrow left
                if(state != "LEFT"){
                    console.log("left");
                    state = "LEFT";
                    car.left();
                }
                break;
            case 'STOP':
                //Arrow left
                if(state != "STOP"){
                    car.stop();
                    state = "STOP";
                    console.log("stop");
                }
                break;
        }
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});