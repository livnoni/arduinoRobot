const ngrok = require('ngrok');
const config = require('../config').ngrock;

const createExternalIPs = async ()=>{
    console.info(`creating ngrok URLS...`)
    try {
        const url_port_3000 = await ngrok.connect({
            proto: 'http',
            authtoken: config.ngrokToken,
            addr: 3000,
            region: config.region,
            onStatusChange: status => {console.log("url_port_3000 status:",status)}, // 'closed' - connection is lost, 'connected' - reconnected
            onLogEvent: data => {if(config.debugger) console.log("data (url_port_3000): ",data)}
        });
        console.log("url_port_3000: ",url_port_3000);
        const url_port_8000 = await ngrok.connect({
            proto: 'http',
            authtoken: config.ngrokToken,
            addr: 8081,
            region: config.region,
            onStatusChange: status => {console.log("url_port_8081 status",status)}, // 'closed' - connection is lost, 'connected' - reconnected
            onLogEvent: data => {if(config.debugger) console.log("data (url_port_8081): ",data)}
        });
        console.log("url_port_8081: ",url_port_8000);
        return [url_port_3000, url_port_8000];
    }catch (e) {
        console.warn('got error while try to create ngrok url - you can still use the robot on your local network!');
    }
};

module.exports = createExternalIPs;

(async ()=>{
    if(config.enable) await createExternalIPs();
})();