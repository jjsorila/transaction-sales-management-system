const express = require("express");
const app = express();
const db = require("./config/db");
const cookieSession = require("cookie-session");

//GLOBAL MIDDLEWARES
app.set("view engin", "ejs")
app.use(express.static("public"))
app.use(cookieSession({
    secret: "zNuM1F%Q!w6i6KsY3So^O8y3SGRv%",
    maxAge: 1000 * 60 * 60 * 24 * 7
}))
app.use(express.json(), express.urlencoded({ extended: true }))

//ROUTES
//A.P.I.
app.use("/api", require("./controllers/api"))

//VIEWS
app.use("/", require("./controllers/admin"))


//DB & PORT CONNECTION
db.connect((error) => {
    if(error) throw error;
    app.listen(80, () => {
        console.log("Listening to port 80")
        console.log("Database Connected")
    })
})