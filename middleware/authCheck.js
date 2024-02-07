const authCheck = (req, res, next) => {
    if (!req.user) {
        res.redirect(process.env.FRONTEND_URL + "/auth");
    } else {
        next();
    }
};
