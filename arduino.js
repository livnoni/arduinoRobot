let five, board;

const SPEED_HIGH = 255;
const SPEED_MEDIUM = 125;
const SPEED_LOW = 50;

function arduino(socket) {
    return new Promise((resolve) => {
        five = require("johnny-five");
        board = new five.Board();


        board.on("ready", () => {
            console.log("Board is ready!");
            var car = new Car(socket);
            var ledOnBoard = new five.Led(13);
            ledOnBoard.on();

            resolve(car);
        })
    })
}

module.exports = arduino;


class Car {
    constructor(socket) {
        const configs = five.Motor.SHIELD_CONFIGS.ADAFRUIT_V2;

        this.motor1 = new five.Motor(configs.M1);
        this.motor2 = new five.Motor(configs.M2);
        this.motor3 = new five.Motor(configs.M3);
        this.motor4 = new five.Motor(configs.M4);
        this.cameraPosition = 90;
        this.servo = new five.Servo(10);

        this.greenLed = new five.Led(12);
    }

    forward() {
        this.motor1.forward(SPEED_HIGH);
        this.motor2.forward(SPEED_HIGH);
        this.motor3.forward(SPEED_HIGH);
        this.motor4.forward(SPEED_HIGH);
        this.greenLed.on();
    }

    forward_right() {
        this.motor1.forward(SPEED_HIGH);
        this.motor2.forward(SPEED_HIGH);
        this.motor3.forward(SPEED_HIGH / 4);
        this.motor4.forward(SPEED_HIGH / 4);
        this.greenLed.on();
    }

    forward_left() {
        this.motor1.forward(SPEED_HIGH / 4);
        this.motor2.forward(SPEED_HIGH / 4);
        this.motor3.forward(SPEED_HIGH);
        this.motor4.forward(SPEED_HIGH);
        this.greenLed.on();
    }

    backward() {
        this.motor1.reverse(SPEED_HIGH);
        this.motor2.reverse(SPEED_HIGH);
        this.motor3.reverse(SPEED_HIGH);
        this.motor4.reverse(SPEED_HIGH);
        this.greenLed.on();
    }

    backward_right() {
        this.motor1.reverse(SPEED_HIGH);
        this.motor2.reverse(SPEED_HIGH);
        this.motor3.reverse(SPEED_HIGH / 4);
        this.motor4.reverse(SPEED_HIGH / 4);
        this.greenLed.on();
    }

    backward_left() {
        this.motor1.reverse(SPEED_HIGH / 4);
        this.motor2.reverse(SPEED_HIGH / 4);
        this.motor3.reverse(SPEED_HIGH);
        this.motor4.reverse(SPEED_HIGH);
        this.greenLed.on();
    }

    right() {

        this.motor1.forward(SPEED_HIGH);
        this.motor2.forward(SPEED_HIGH);
        this.motor3.reverse(SPEED_HIGH);
        this.motor4.reverse(SPEED_HIGH);
    }

    left() {
        this.motor1.reverse(SPEED_HIGH);
        this.motor2.reverse(SPEED_HIGH);
        this.motor3.forward(SPEED_HIGH);
        this.motor4.forward(SPEED_HIGH);
        this.greenLed.on();
    }


    stop() {
        this.motor1.brake();
        this.motor2.brake();
        this.motor3.brake();
        this.motor4.brake();
        this.greenLed.off();
    }

    cameraUp() {
        if (this.cameraPosition < 180) {
            this.cameraPosition += 10;
            this.servo.to(this.cameraPosition);
        }
    }

    cameraDown() {
        if (this.cameraPosition > 0) {
            this.cameraPosition -= 10;
            this.servo.to(this.cameraPosition);
        }
    }
}