#!/bin/bash
#start up script that run the server and stream the video
#this file suppose to move to ~/ path 

echo "start runnig robot..."
cd /home/pi/arduino/arduinoRobot
npm run camera &
npm run start

