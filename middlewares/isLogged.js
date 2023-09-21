exports.isLoggedIn = (req, res, next) => {
    if(req.session.admin) return res.redirect("/dashboard");
    next();
}

exports.isLoggedOut = (req, res, next) => {
    res.set({
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
    })
    if(!req.session.admin) return res.redirect("/");
    next();
}

