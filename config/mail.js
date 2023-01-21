const nodemailer = require("nodemailer");

module.exports = (email, req) => {
    return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "opas.system@gmail.com",
            pass: "tcwdtheeiyjbsdqg"
        }
    }).sendMail({
        from: `"Bert's Piggery" <opas.system@gmail.com>`,
        to: email,
        subject: `Reset Password`,
        html: `<b>Click this <a href="http://${req.header('host')}/client/reset?email=${email}">link</a> to reset password of your account.</b>`
    })
}