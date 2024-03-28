# arduinoRobot
in order to run this module on linux, please run this before:
sudo apt-get install festival festvox-kallpc16k
sudo apt-get install ffmpeg
sudo apt-get install libasound2-dev
install web camera:
https://pimylifeup.com/raspberry-pi-webcam-server/
motion documantation: https://motion-project.github.io/motion_config.html
https://stackoverflow.com/questions/20300668/rasberry-pi-raspbian-motion-usb-camera-black-image



install nodejs with nvm: https://www.jemrf.com/pages/how-to-install-nvm-and-node-js-on-raspberry-pi

use pm2: https://pm2.keymetrics.io/docs/usage/quick-start/
npm install pm2@latest -g
pm2 start server.js
pm2 startup (copy and paste)