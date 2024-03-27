const isTouchDevice = 'ontouchstart' in document.documentElement;
const divButtonsContainer = document.getElementById("buttons-container");
const buttons = divButtonsContainer.getElementsByTagName("button");

for(let i=0; i<buttons.length; i++){
    if(isTouchDevice){
        buttons[i].removeAttribute("onmousedown");
        buttons[i].removeAttribute("onmouseup");
    }else{
        buttons[i].removeAttribute("ontouchstart");
        buttons[i].removeAttribute("ontouchend");
    }
}


document.getElementById("ip-input").value = `http://${location.hostname}:8081`

var camera_mode = false;
function cameraMode(){
    camera_mode = !camera_mode;
    if(camera_mode) document.getElementById("cameraMode").style.background = 'red';
    else document.getElementById("cameraMode").style.background = '';
}

var sayInput = document.getElementById("say-input");
var sayInputActive = false;

sayInput.addEventListener("focus", () => {
    sayInputActive = true;
}, true);
sayInput.addEventListener("blur", () => {
    sayInputActive = false;
}, true);

window.addEventListener("keydown", function (e) {
    // space and arrow keys
    if (!sayInputActive && [32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

function setVideoSize(param) {
    let currentWidth = document.getElementById("live-camera").width;
    let currentHeight = document.getElementById("live-camera").height;
    document.getElementById("live-camera").width = param == "INCREASE" ? currentWidth + 100 : currentWidth - 100;
    document.getElementById("live-camera").height = param == "INCREASE" ? currentHeight + 100 : currentHeight - 100;
}

function buttonPressed(direction) {
    console.log('buttonPressed=', direction);
    emit(direction);
}

function buttonReleased(direction) {
    console.log('buttonReleased=', direction);
    emit("STOP");
}


const socket = io();
const keysPressed = {};


document.onkeydown = function (evt) {
    evt = evt || window.event;
    keysPressed[evt.code] = true;
    if(sayInputActive) return;

    if(camera_mode){
        switch (evt.code) {
            case 'KeyW':
                emit("CAMERA_UP");
                break;
            case 'KeyS':
                emit("CAMERA_DOWN");
                break;
            default:
                alert('Camera Mode is on! make sure the robot connect to electric supply and set Camera mode to off.');
        }
        return;
    }

    if(keysPressed['ArrowUp'] && keysPressed['ArrowRight']){
        emit("FORWARD_RIGHT");
        return;
    }
    if(keysPressed['ArrowUp'] && keysPressed['ArrowLeft']){
        emit("FORWARD_LEFT");
        return;
    }
    if(keysPressed['ArrowUp']){
        emit("FORWARD");
        return;
    }
    if(keysPressed['ArrowDown'] && keysPressed['ArrowRight'] ){
        emit("BACKWARD_RIGHT");
        return;
    }
    if(keysPressed['ArrowDown'] && keysPressed['ArrowLeft'] ){
        emit("BACKWARD_LEFT");
        return;
    }
    if(keysPressed['ArrowDown'] ){
        emit("BACKWARD");
        return;
    }
    if(keysPressed['ArrowLeft']){
        emit("LEFT");
        return;
    }
    if(keysPressed['ArrowRight']){
        emit("RIGHT");
        return;
    }
    if(keysPressed['KeyW']){
        emit("CAMERA_UP");
        return;
    }
    if(keysPressed['KeyS']){
        emit("CAMERA_DOWN");
        return;
    }
};

document.onkeyup = function (evt) {
    evt = evt || window.event;
    delete keysPressed[evt.code];
    if(sayInputActive) return;
    if(camera_mode){
        switch (evt.code) {
            case 'KeyW':
                emit("CAMERA_STOP");
                break;
            case 'KeyS':
                emit("CAMERA_STOP");
                break;
            default:
                alert('Camera Mode is on! make sure the robot connect to electric supply and set Camera mode to off.');
        }
        return;
    }

    if(Object.keys(keysPressed).length > 0){
        if(keysPressed['ArrowUp']){
            emit("FORWARD");
            return;
        }
        if(keysPressed['ArrowDown'] ){
            emit("BACKWARD");
            return;
        }
        if(keysPressed['ArrowLeft']){
            emit("LEFT");
            return;
        }
        if(keysPressed['ArrowRight']){
            emit("RIGHT");
            return;
        }
        return;
    }
    switch (evt.code) {
        case 'ArrowUp':
            emit("STOP");
            break;
        case 'ArrowDown':
            emit("STOP");
            break;
        case 'ArrowLeft':
            emit("STOP");
            break;
        case 'ArrowRight':
            emit("STOP");
            break;
        case 'KeyW':
            emit("CAMERA_STOP");
            break;
        case 'KeyS':
            emit("CAMERA_STOP");
            break;
    }

};

function emit(data) {
    console.log(data);
    let buttons = document.getElementsByClassName("button");
    for (let i = 0; i < buttons.length; i++) {
        if(buttons[i].id.includes("CAMERA")){
            if (data != "STOP" && buttons[i].id.includes(data)) buttons[i].style.background = 'blue';
            else buttons[i].style.background = '#4CAF50';
            continue;
        }
        if(camera_mode) continue;
        if (data != "STOP" && data.split("_").some(o=>buttons[i].id.includes(o))) buttons[i].style.background = 'blue';
        else buttons[i].style.background = '#4CAF50';
    }
    if (data.includes("CAMERA")) {
        socket.emit('camera', data);
    } else {
        socket.emit('robot', data);
    }

}

function setVideoStreaming() {
    let currentUrl = window.location.hostname;
    if(currentUrl !== 'localhost') return;
    let videoSrc = `${currentUrl}:8000`;
    document.getElementById("live-camera").src = videoSrc;
    document.getElementById("ip-input").value = videoSrc;
}

setVideoStreaming();

function onIpInputChange() {
    let ip = document.getElementById("ip-input").value;
    document.getElementById("live-camera").src = `${ip}/stream.mjpg`;
}

function onSayInputChange() {
    let sayButton = document.getElementById("say_button");
    sayButton.disabled = true;
    setTimeout(() => {
        sayButton.disabled = false
    }, 2000)
    let sayData = document.getElementById("say-input").value + "\n";
    let multiplyBy = document.getElementById("say_select").options[document.getElementById("say_select").selectedIndex].value.split("multi by ")[1];
    console.log("sayData=", sayData);
    console.log("multiplyBy=", multiplyBy);
    socket.emit('say', sayData.repeat(multiplyBy));
}

function onYoutube(data) {
    let buttonPlay = document.getElementById("button-youtube-play");
    if (data == "STOP") {
        console.log("youtube->STOP");
        socket.emit('youtube', data);
        buttonPlay.style.background = "";
    } else {
        let youtubeUrl = document.getElementById("youtube-input").value;
        console.log("youtube=", youtubeUrl);
        socket.emit('youtube', youtubeUrl);
        buttonPlay.style.background = "blue";
    }
}
