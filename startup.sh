#!/bin/bash
#start up script that run the server and stream the video
#this file suppose to move to ~/ path 

echo "start runnig robot..."
npm run camera &
npm run start

