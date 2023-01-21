const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("pages/login.ejs")
})

router.get("/dashboard", (req, res) => {
    res.render("pages/dashboard.ejs")
})


module.exports = router;