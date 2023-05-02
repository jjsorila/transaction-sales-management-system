const nodemailer = require("nodemailer");
const Sendinblue = require("nodemailer-sendinblue-transport");

// module.exports = (email, req) => {
//     return nodemailer.createTransport({
//         host: "smtp-relay.sendinblue.com",
//         port: 587,
//         auth: {
//             user: "plogic9@gmail.com",
//             pass: "7BJRgkMGOFAdqjzU"
//         }
//     }).sendMail({
//         from: `"Bert's Piggery" <plogic9@gmail.com>`,
//         to: email,
//         subject: `Reset Password`,
//         html: `<b>Click this <a href="http://${req.header('host')}/reset?email=${email}">link</a> to reset password of your account.</b>`
//     })
// }

module.exports = (email, req) => {
    return nodemailer.createTransport(new Sendinblue({
        apiKey: "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"
    })).sendMail({
        from: `"Bert's Piggery" <plogic9@gmail.com>`,
        to: email,
        subject: `Reset Password`,
        html: `<b>Click this <a href="http://${req.header('host')}/reset?email=${email}">link</a> to reset password of your account.</b>`
    })
}