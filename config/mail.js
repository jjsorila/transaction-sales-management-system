const nodemailer = require("nodemailer");

module.exports = (email, req) => {
    return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "business.piggery@gmail.com",
            pass: "iitdtkwrvsaxozpf"
        }
    }).sendMail({
        from: `"Bert's Piggery" <business.piggery@gmail.com>`,
        to: email,
        subject: `Reset Password`,
        html: `<b>Click this <a href="http://${req.header('host')}/client/reset?token=${token}" >link</a> to reset password of your account.</b>`
    })
}