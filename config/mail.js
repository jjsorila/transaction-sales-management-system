require("dotenv").config({ path: `${process.cwd()}/.env` })
const nodemailer = require("nodemailer");
const Sendinblue = require("nodemailer-sendinblue-transport");

module.exports = (email, req) => {
    return nodemailer.createTransport(new Sendinblue({
        apiKey: process.env.API_KEY
    })).sendMail({
        from: `"Bert's Piggery" <plogic9@gmail.com>`,
        to: email,
        subject: `Reset Password`,
        html: `<b>Click this <a href="http://${req.header('host')}/reset?email=${email}">link</a> to reset password of your account.</b>`
    })
}