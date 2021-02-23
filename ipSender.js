const ip = require('ip');
const nodeMailer = require('nodemailer');

function sendIp(from, pass, to, ngrokUrls){
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
        html: `<p>Your robot ip here: ${ip.address()}</p> <p>Link to robot controller: ${ip.address()}:3000</p>${(ngrokUrls && ngrokUrls.length > 0) ? `<p>Link to external IP 1: ${ngrokUrls[0]}</p><p>Link to external IP 2: ${ngrokUrls[1]}</p>` : null}`
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
            console.log(err)
        else
            console.log(info);
    });
}


module.exports = sendIp;
