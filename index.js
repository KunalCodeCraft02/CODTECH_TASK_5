const express = require("express");
const app = express();
const path = require("path");
const mongoConnection = require("./config/mongoose-connection");
const { profile, router, home, postedit,chat, postdata,search,sendpost, editdata, signin, register, login, loginuser, editpro, logout } = require("./router/router");
const cookieParser = require("cookie-parser");
const isLoggedin = require("./middleware/isLoggedin");
const upload = require("./config/multer");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");

app.get("/signin", signin);
app.post("/signin", register);
app.get("/login", login);
app.post("/login", loginuser);
app.get("/logout", logout);

app.get("/", isLoggedin, home);
app.get("/chat", isLoggedin, chat);
app.get("/search", isLoggedin, search);
app.get("/profile", isLoggedin, profile);
app.get("/edit/:id", isLoggedin, editpro);
app.post("/edit/:id", isLoggedin,upload.single("profilePic"),editdata);
app.get("/sendpost/:id",isLoggedin,sendpost);
app.post("/sendpost/:id",isLoggedin,postdata);


app.listen(3000, (e) => {
    console.log("SERVER STARTED");
});
