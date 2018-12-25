var five,board;

const SPEED_HIGH = 255;
const SPEED_MEDIUM = 125;
const SPEED_LOW = 50;

function arduino(){
    return new Promise((resolve)=>{
         five = require("johnny-five");
         board = new five.Board();


        board.on("ready", ()=>{
            console.log("Board is ready!");
            var car = new Car();
            var led = new five.Led(13);

            led.on();

            resolve(car);
        })
    })
}

module.exports = arduino;


class Car{
    constructor(){
        const configs = five.Motor.SHIELD_CONFIGS.ADAFRUIT_V2;

        this.motor1 = new five.Motor(configs.M1);
        this.motor2 = new five.Motor(configs.M2);
        this.motor3 = new five.Motor(configs.M3);
        this.motor4 = new five.Motor(configs.M4);
        this.cameraPosition = 90;
        this.servo = new five.Servo(10);
    }

    forward(){
        this.motor1.forward(SPEED_HIGH);
        this.motor2.forward(SPEED_HIGH);
        this.motor3.forward(SPEED_HIGH);
        this.motor4.forward(SPEED_HIGH);
    }

    backward(){

        this.motor1.reverse(SPEED_HIGH);
        this.motor2.reverse(SPEED_HIGH);
        this.motor3.reverse(SPEED_HIGH);
        this.motor4.reverse(SPEED_HIGH);
    }

    right(){

        this.motor1.forward(SPEED_HIGH);
        this.motor2.forward(SPEED_HIGH);
        this.motor3.reverse(SPEED_HIGH);
        this.motor4.reverse(SPEED_HIGH);
    }


    left(){

        this.motor1.reverse(SPEED_HIGH);
        this.motor2.reverse(SPEED_HIGH);
        this.motor3.forward(SPEED_HIGH);
        this.motor4.forward(SPEED_HIGH);
    }


    stop(){
        this.motor1.brake();
        this.motor2.brake();
        this.motor3.brake();
        this.motor4.brake();
    }

    cameraUp(){
        if(this.cameraPosition < 180){
            this.cameraPosition += 10;
            this.servo.to(this.cameraPosition);
        }
    }
    cameraDown(){
        if(this.cameraPosition > 0) {
            this.cameraPosition -= 10;
            this.servo.to(this.cameraPosition);
        }

    }

}