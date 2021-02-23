const sendIp = require('./ipSender');
const createExternalIPs = require('./exteralIP');
const config = require('./config');
require('./server');

(async ()=>{
    if(config.ngrock){
        const staticURLs = await createExternalIPs();
        if(config["ip-mail"].sendMailOnStartServer){
            sendIp(config["ip-mail"].from, config["ip-mail"].pass, config["ip-mail"].to, staticURLs);
        }
    }
})();