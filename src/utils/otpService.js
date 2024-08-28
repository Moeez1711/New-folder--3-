const nodemailer = require('nodemailer');

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

function sendOTPEmail(email, otp) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sheikhs0097@gmail.com',
            pass: 'kmre hews cxxb pctr'
        }
    });
 
    const mailOptions = {
        from: 'sheikhs0097@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
    };

    return transporter.sendMail(mailOptions);
}

module.exports = { generateOTP, sendOTPEmail };
