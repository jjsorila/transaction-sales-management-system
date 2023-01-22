const express = require("express");
const router = express.Router();
const db = require("../config/db")
const transporter = require("../config/mail")
const bcrypt = require("bcryptjs");
const uuid = require("uuid")
const dayjs = require("dayjs")

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

//GET ADMIN ACCOUNTS
router.get("/accounts/get", (req, res) => {
    db.query(`SELECT * FROM admin ORDER BY username`, (err, result) => {
        if(err) throw err;

        return res.json({
            data: [ ...result ]
        })
    })
})

//ADD ADMIN ACCOUNT
router.post("/account/add", (req, res) => {
    let { username, email, password } = req.body

    db.query(`SELECT * FROM admin WHERE username=${db.escape(username)} OR email=${db.escape(email)}`, (err, result) => {
        if(err) throw err;

        if(result.length > 0) return res.json({ msg: "Account already exists", operation: false })

        password = bcrypt.hashSync(password, 10)

        db.query(`INSERT INTO admin VALUES(${db.escape(username)},${db.escape(email)},${db.escape(password)})`, (insertError) => {
            if(insertError) throw insertError;

            return res.json({ msg: "Account added", operation: true })
        })
    })
})

//GET ADMIN ACCOUNT
router.get("/account/get", (req, res) => {
    const { username } = req.query

    db.query(`SELECT * FROM admin WHERE username=${db.escape(username)}`, (err, result) => {
        if(err) throw err;

        return res.json(result)
    })
})

//EDIT ADMIN ACCOUNT
router.put("/account/edit", (req, res) => {
    let { username, email, password } = req.body

    let query = `UPDATE admin SET email=${db.escape(email)} WHERE username=${db.escape(username)}`

    if(password){
        password = bcrypt.hashSync(password, 10)
        query = `UPDATE admin SET email=${db.escape(email)},password=${db.escape(password)} WHERE username=${db.escape(username)}`
    }

    db.query(query, (err) => {
        if(err) throw err;

        return res.json({ msg: "Account updated", operation: true })
    })
})

//DELETE ADMIN ACCOUNT
router.delete("/account/delete", (req, res) => {
    const { username } = req.query

    db.query(`DELETE FROM admin WHERE username=${db.escape(username)}`, (err) => {
        if(err) throw err;

        return res.json({ msg: "Account deleted", operation: true })
    })
})

//GET EXPENSES
router.get("/expenses", (req, res) => {
    db.query(`SELECT * FROM expenses ORDER BY expense_date DESC`, (err, result) => {
        if(err) throw err;

        res.json({ data: result.map((expense) => {
            return {
                ...expense,
                expense_date: dayjs(expense.expense_date).format("MMM D, YYYY")
            }
        }) })
    })
})

//ADD EXPENSE
router.post("/expense/add", (req, res) => {
    const { item, quantity, unit_price, expense_date } = req.body;

    db.query(`INSERT INTO expenses VALUES(${db.escape(uuid.v4())},${db.escape(item)},${db.escape(quantity)},${db.escape(unit_price)},${db.escape((quantity * unit_price))},${db.escape(expense_date)})`, (err) => {
        if(err) throw err;

        return res.json({ msg: "Expense record added", operation: true })
    })
})

//DELETE EXPENSE
router.delete("/expense/delete", (req, res) => {
    const { id } = req.query

    db.query(`DELETE FROM expenses WHERE id=${db.escape(id)}`, (err) => {
        if(err) throw err;

        return res.json({ msg: "Record deleted", operation: true })
    })
})

//GET RANGE EXPENSES
router.get("/expenses/range", (req, res) => {
    const { start, end }= req.query

    db.query(`SELECT * FROM expenses WHERE expense_date BETWEEN ${db.escape(start)} AND ${db.escape(end)} ORDER BY expense_date DESC`, (err, result) => {
        if(err) throw err;

        return res.json({
            data: result.map((v) => {
                return {
                    ...v,
                    expense_date: dayjs(v.expense_date).format("MMM D, YYYY"),
                    expense_id: v.id
                }
            })
        })
    })
})

//GET TRANSACTIONS
router.get("/transactions", (req, res) => {
    db.query(`SELECT * FROM transactions ORDER BY transaction_date DESC`, (err, result) => {
        if(err) throw err;

        return res.json({
            data: result.map((v) => ({
                ...v,
                transaction_date: dayjs(v.transaction_date).format("MMM D, YYYY"),
                transaction_id: v.id
            }))
        })
    })
})

//ADD TRANSACTION
router.post("/transaction/add", (req, res) => {
    const { recipient, unit_price, quantity, transaction_date } = req.body

    db.query(`INSERT INTO transactions VALUES(${db.escape(uuid.v4())},${db.escape(recipient)},${db.escape((quantity * unit_price))},${db.escape(transaction_date)},${db.escape(quantity)},${db.escape(unit_price)})`, (err) => {
        if(err) throw err;

        return res.json({ msg: "Record added", operation: true })
    })
})

//GET 1 TRANSACTION
router.get("/transaction/:id", (req, res) => {
    const { id } = req.params

    db.query(`SELECT * FROM transactions WHERE id=${db.escape(id)}`, (err, result) => {
        if(err) throw err;

        return res.json(result[0])
    })
})

//DELETE TRANSACTION
router.delete("/transaction/:id", (req, res) => {
    const { id } = req.params

    db.query(`DELETE FROM transactions WHERE id=${db.escape(id)}`, (err) => {
        if(err) throw err;

        return res.json({ msg: "Record deleted", operation: true })
    })
})

//GET RANGE TRANSACTIONS
router.get("/transactions/range", (req, res) => {
    const { start, end } = req.query

    db.query(`SELECT * FROM transactions WHERE transaction_date BETWEEN ${db.escape(start)} AND ${db.escape(end)} ORDER BY transaction_date DESC`, (err, result) => {
        if(err) throw err;

        return res.json({
            data: result.map((v) => ({
                ...v,
                transaction_date: dayjs(v.transaction_date).format("MMM D, YYYY")
            }))
        })
    })
})

module.exports = router;