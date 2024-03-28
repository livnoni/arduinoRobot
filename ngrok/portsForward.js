const ngrok = require("@ngrok/ngrok");

const config = require('../config').ngrock;

const portsForward = async ()=>{
    console.info(`creating ngrok URLS...`)
    try {

        // Establish connectivity
        const serverListener = await ngrok.forward({
            proto: 'http',
            addr: 3000,
            authtoken: config.ngrokToken
        });

        // Output ngrok url to console
        console.log(`Ingress established at: ${serverListener.url()} for port: ${3000}`);


        // Establish connectivity
        const videoListener = await ngrok.forward({
            proto: 'http',
            addr: 8081,
            authtoken: config.ngrokToken
        });

        // Output ngrok url to console
        console.log(`Ingress established at: ${videoListener.url()} for port: ${8081}`);

        return true;
    }catch (e) {
        console.warn('got error while try to create ngrok url - you can still use the robot on your local network!',e);
    }
};


module.exports = portsForward;

// (async ()=>{
//     if(config.enable) await portsForward();
// })();