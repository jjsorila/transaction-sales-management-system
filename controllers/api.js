const express = require("express");
const router = express.Router();
const db = require("../config/db")
const transporter = require("../config/mail")
const bcrypt = require("bcryptjs");
const uuid = require("uuid")

//LOGIN
router.post("/login", (req, res) => {
    const { username, password } = req.body

    db.query(`SELECT * FROM admin WHERE username=${db.escape(username)}`, (error, result) => {
        if(error) throw error;

        if (result.length <= 0) return res.json({ msg: "Invalid Credentials", operation: false })

        const hashedPwd = result[0].password

        if (!bcrypt.compareSync(password, hashedPwd)) return res.json({ msg: "Invalid Credentials", operation: false })

        req.session.admin = {
            username: result[0].username,
            email: result[0].email
        }

        return res.json({ msg: "Oks", operation: true })

    })
})

//LOGOUT
router.get("/logout", (req, res) => {
    try {
        req.session = null
        res.json({ operation: true })
    } catch (error) {
        console.log(error)
        res.json({ operation: false })
    }
})

//SEND RESET PASSWORD LINK
router.post("/reset", (req, res) => {

    const { email } = req.body;

    db.query(`SELECT * FROM admin WHERE email=${db.escape(email)}`, (error, result) => {

        if(result.length <= 0) return res.json({ msg: "Invalid email!", operation: false })

        transporter(email, req).then((msg) => {
            return res.json({ msg: "Password Reset Link Sent!", operation: true })
        }).catch((mailError) => {
            console.log(mailError)
        })
    })

})

//CHANGE PASSWORD
router.put("/reset", (req, res) => {
    let { email, password } = req.body;

    password = bcrypt.hashSync(password, 10);

    db.query(`UPDATE admin SET password=${db.escape(password)} WHERE email=${db.escape(email)}`, (error, result) => {
        if(error){
            res.json({ msg: "Server Error", operation: false })
            throw error;
        }

        return res.json({ msg: "Success", operation: true })
    })
})

//ADD EVENT
router.post("/event/add", (req, res) => {
    const { badge, event_date, desc, username } = req.body

    db.query(`INSERT INTO events VALUES(${db.escape(uuid.v4())},${db.escape(desc)},${db.escape(event_date)},${db.escape(badge)},${db.escape(username)})`)

    res.json({ msg: "Event added!", operation: true })
})

//DELETE EVENT
router.delete("/event/delete", (req, res) => {
    const { event_id } = req.query

    db.query(`DELETE FROM events WHERE id=${db.escape(event_id)}`)

    res.json({ msg: "Event deleted!", operation: true })
})

//GET EVENTS
router.get("/event/get", (req, res) => {
    const { username } = req.query

    db.query(`SELECT * FROM events WHERE username=${db.escape(username)}`, (err, result) => {
        if(err) throw err;

        return res.json(result);
    })
})

module.exports = router;