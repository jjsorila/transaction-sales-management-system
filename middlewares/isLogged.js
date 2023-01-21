exports.isLoggedIn = (req, res, next) => {
    if(req.session.admin) return res.redirect("/dashboard");
    next();
}

exports.isLoggedOut = (req, res, next) => {
    if(!req.session.admin) return res.redirect("/");
    next();
}

