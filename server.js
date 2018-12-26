var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

require("./ipSender");

const say = require('say');
const Youtube = require('./youtube');
var youtube = new Youtube();

var car;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', async function(socket){
    console.log('a user connected');

    if(!car) car = await require('./arduino')();

    var state = "";

    socket.on('robot', function(msg){
        console.log('robot: ' + msg+', state= '+state);
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
                    console.log("BACKWARD");
                    state = "BACKWARD";
                    car.backward();
                }
                break;
            case 'RIGHT':
                //Arrow right
                if(state != "RIGHT"){
                    if(state == "FORWARD-RIGHT" || state == "FORWARD"){
                        if(state != "FORWARD-RIGHT"){
                            console.log("FORWARD-RIGHT");
                            state = "FORWARD-RIGHT";
                            car.forward_right();
                        }
                    }else if(state == "BACKWARD-RIGHT" || state == "BACKWARD"){
                        if(state != "BACKWARD-RIGHT"){
                            console.log("BACKWARD-RIGHT");
                            state = "BACKWARD-RIGHT";
                            car.backward_right();
                        }
                    }else{
                        console.log("RIGHT");
                        state = "RIGHT";
                        car.right();
                    }
                }
                break;

            case 'LEFT':
                //Arrow right
                if(state != "LEFT"){
                    if(state == "FORWARD-LEFT" || state == "FORWARD"){
                        if(state != "FORWARD-LEFT"){
                            console.log("FORWARD-LEFT");
                            state = "FORWARD-LEFT";
                            car.forward_left();
                        }
                    }else if(state == "BACKWARD-LEFT" || state == "BACKWARD"){
                        if(state != "BACKWARD-LEFT"){
                            console.log("BACKWARD-LEFT");
                            state = "BACKWARD-LEFT";
                            car.backward_left();
                        }
                    }else{
                        console.log("LEFT");
                        state = "LEFT";
                        car.left();
                    }
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

    socket.on("camera", function(msg){
        console.log("got  camera: ",msg)
        switch(msg) {
            case 'CAMERA_UP':
                console.log("CAMERA_UP");
                car.cameraUp();
                break;
            case 'CAMERA_DOWN':
                console.log("CAMERA_DOWN");
                car.cameraDown();
                break;
        }
    });

    socket.on("say", function(msg){
        try{
            console.log("got say:", msg)
            say.speak(msg);
        }catch (e) {
            console.error("Speak err:",e);
        }
    });

    socket.on("youtube", async function(data){
        console.log("server got youtube -> "+data);
        try{
            if(data=='STOP'){
                youtube.stop();
            }else{
                youtube.play(data);
            }
        }catch (e) {
            console.error("youtube err:",e);
        }
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});