const nodemailer = require('nodemailer');

const sendOtpEmail = (email, otp) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD,
        },
    });

    let mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: "Account created successfully",
        text: `
                      Welcome to the Ambulance Service.,
                      Thank you for choosing us!
                      Your OTP is ${otp}
                      `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return { error: error };
        } else {
            return resp.json({ success: true, message: info.response });
        }
    });
};

module.exports = sendOtpEmail
