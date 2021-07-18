const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    try {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'kharshit01042001@gmail.com',
              pass: '1234'
            }
          });
          
          var mailOptions = {
            from: 'kharshit01042001@gmail.com',
            to: email,
            subject: 'Sending Email using Node.js',
            text: text
            // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'        
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;