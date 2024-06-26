const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const sendIp = require('./src/ipSender');
const config = require('./config');
const portsForward = require('./ngrok/portsForward');


// const say = require('say');
// const Youtube = require('./src/youtube');
// var youtube = new Youtube();

var car;

app.use(express.static(path.join(__dirname, 'client')));

io.on('connection', async function(socket){
    console.log('a user connected');

    if(!car) car = await require('./arduino')(io.sockets);

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
            case 'FORWARD_RIGHT':
                //Arrow up and right
                if(state != "FORWARD_RIGHT"){
                    console.log("FORWARD_RIGHT");
                    state = "FORWARD_RIGHT";
                    car.forward_right();
                }
                break;
            case 'FORWARD_LEFT':
                //Arrow up and right
                if(state != "FORWARD_LEFT"){
                    console.log("FORWARD_LEFT");
                    state = "FORWARD_LEFT";
                    car.forward_left();
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
            case 'BACKWARD_RIGHT':
                //Arrow down
                if(state != "BACKWARD_RIGHT"){
                    console.log("BACKWARD_RIGHT");
                    state = "BACKWARD_RIGHT";
                    car.backward_right();
                }
                break;
            case 'BACKWARD_LEFT':
                //Arrow down
                if(state != "BACKWARD_LEFT"){
                    console.log("BACKWARD_LEFT");
                    state = "BACKWARD_LEFT";
                    car.backward_left();
                }
                break;
            case 'RIGHT':
                //Arrow right
                if(state != "RIGHT"){
                    console.log("RIGHT");
                    state = "RIGHT";
                    car.right();
                }
                break;
            case 'LEFT':
                //Arrow right
                if(state != "LEFT"){
                    console.log("LEFT");
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

    // socket.on("youtube", async function(data){
    //     console.log("server got youtube -> "+data);
    //     try{
    //         if(data=='STOP'){
    //             youtube.stop();
    //         }else{
    //             youtube.play(data);
    //         }
    //     }catch (e) {
    //         console.error("youtube err:",e);
    //     }
    // });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');

    if(config["ip-mail"].sendMailOnStartServer){
        sendIp(config["ip-mail"].from, config["ip-mail"].pass, config["ip-mail"].to);
    }

    if(config?.ngrock?.enable){
        portsForward()
    }

});