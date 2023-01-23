const nodemailer = require("nodemailer");

module.exports = (email, req) => {
    return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "piggery.berts@gmail.com",
            pass: "oumvzmeywqtoqbuj"
        }
    }).sendMail({
        from: `"Bert's Piggery" <piggery.berts@gmail.com>`,
        to: email,
        subject: `Reset Password`,
        html: `<b>Click this <a href="http://${req.header('host')}/reset?email=${email}">link</a> to reset password of your account.</b>`
    })
}