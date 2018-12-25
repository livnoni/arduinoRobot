var ip = require('ip');

const nodeMailer = require('nodemailer');
const config = require("./config.json")

function sendIp(from, pass, to){
    var transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: from,
            pass: pass
        }
    });

    const mailOptions = {
        from: from, // sender address
        to: to, // list of receivers
        subject: 'Robo Yuda Ip', // Subject line
        html: `<p>Your robot ip here: ${ip.address()}</p> <p>Link to robot controller: ${ip.address()}:3000</p>`// plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
            console.log(err)
        else
            console.log(info);
    });
}


if(config["ip-mail"].sendMailOnStartServer){
    sendIp(config["ip-mail"].from, config["ip-mail"].pass, config["ip-mail"].to);
}
