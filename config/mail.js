const nodemailer = require("nodemailer");

module.exports = (email, req) => {
    return nodemailer.createTransport({
        host: "smtp-relay.sendinblue.com",
        port: 587,
        auth: {
            user: "plogic9@gmail.com",
            pass: "7BJRgkMGOFAdqjzU"
        }
    }).sendMail({
        from: `"Bert's Piggery" <plogic9@gmail.com>`,
        to: email,
        subject: `Reset Password`,
        html: `<b>Click this <a href="http://${req.header('host')}/reset?email=${email}">link</a> to reset password of your account.</b>`
    })
}