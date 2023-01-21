const express = require("express");
const db = require("../config/db");
const router = express.Router();
const { isLoggedIn, isLoggedOut } = require("../middlewares/isLogged");

//LOGIN PAGE
router.get("/", isLoggedIn, (req, res) => {
    res.render("pages/login.ejs")
})

//RESET PWD PAGE
router.get("/reset", (req, res) => {

    const { email } = req.query;

    db.query(`SELECT * FROM admin WHERE email=${db.escape(email)}`, (error, result) => {
        if(error) throw error;

        if(result.length <= 0) return res.redirect("/")

        res.render("pages/reset.ejs", { email })
    })
})

//DASHBOARD PAGE
router.get("/dashboard", isLoggedOut, (req, res) => {
    // req.session = null
    res.render("pages/dashboard.ejs", { admin: req.session.admin })
})

//ACCOUNTS PAGE
router.get("/account", isLoggedOut, (req, res) => {
    res.render("pages/account.ejs", { admin: req.session.admin })
})

//EXPENSES PAGE
router.get("/expenses", isLoggedOut, (req, res) => {
    res.render("pages/expenses.ejs", { admin: req.session.admin })
})

//TRANSACTIONS PAGE
router.get("/transactions", isLoggedOut, (req, res) => {
    res.render("pages/transactions.ejs", { admin: req.session.admin })
})

//EDIT EXPENSE PAGE
router.get("/expenses/:id", isLoggedOut, (req, res) => {
    res.render("pages/forms/expense.ejs", { admin: req.session.admin })
})

//EDIT TRANSACTION PAGE
router.get("/transactions/:id", isLoggedOut, (req, res) => {
    res.render("pages/forms/transaction.ejs", { admin: req.session.admin })
})


module.exports = router;