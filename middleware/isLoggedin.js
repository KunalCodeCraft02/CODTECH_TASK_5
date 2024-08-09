const jwt = require("jsonwebtoken");

const isLoggedin = (req, res, next) => {
    if (!req.cookies.token) {
        return res.send("You must be logged in");
    } else {
        try {
            let data = jwt.verify(req.cookies.token, "thenameiskunalkailasbodkhe");
            req.user = data;
            next();
        } catch (e) {
            return res.send("Invalid token");
        }
    }
};

module.exports = isLoggedin;
