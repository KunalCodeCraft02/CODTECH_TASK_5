const express = require("express");
const router = express.Router();
const usermodel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("../config/multer");
const postmodel = require('../models/post');


const signin = (req, res) => {
    res.render("signin");
}

const home = async (req, res) => {
    let find = await usermodel.findOne({ email: req.user.email })
    res.render("home", { usr: find });
    console.log(find);
};

const profile = async (req, res) => {
    try {
        let findusr = await usermodel.findOne({ email: req.user.email }).populate('post');
        res.render("profile", { usr: findusr });
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal server error");
    }
};


const chat = (req, res) => {
    res.render("chat");
};

const search = async (req, res) => {
    let find = await usermodel.findOne(req.user._id);
    res.render("search", { usr: find });
};

const login = (req, res) => {
    res.render("login");
};
const sendpost = async (req, res) => {
    let usr = await usermodel.findOne(req.user.id);
    res.render("postcreation", { usr: usr });
};






const editpro = async (req, res) => {
    try {
        let user = await usermodel.findById(req.params.id);
        if (!user) {
            res.status(404).send("User not found");
        } else {
            res.render("editprofile", { user: user });
        }
    } catch (e) {
        res.status(500).send("Internal server error");
    }
};

const register = async (req, res) => {
    let { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            res.send("All fields are mandatory");
        } else {
            let findemail = await usermodel.findOne({ email: req.body.email });
            if (findemail) {
                res.send("Email already exists");
            } else {
                let hashpassword = await bcrypt.hash(password, 12);
                const createuser = await usermodel.create({
                    username: username,
                    email: email,
                    password: hashpassword,
                });
                let token = jwt.sign({ email: email, userid: createuser._id }, "thenameiskunalkailasbodkhe", { expiresIn: '1h' });
                res.cookie("token", token);
                res.redirect("/");
            }
        }
    } catch (e) {
        res.status(500);
        res.send("Internal server error");
    }
}

const loginuser = async (req, res) => {
    let { email, password } = req.body;
    try {
        if (!email || !password) {
            res.send("All fields are mandatory");
        } else {
            let finduser = await usermodel.findOne({ email: email });
            if (finduser) {
                let compare = await bcrypt.compare(password, finduser.password);
                if (compare) {
                    let token = jwt.sign({ email: finduser.email, userid: finduser._id }, "thenameiskunalkailasbodkhe", { expiresIn: '1h' });
                    res.cookie("token", token);
                    res.redirect("/");
                } else {
                    res.send('Incorrect password');
                }
            } else {
                res.send("User not found");
            }
        }
    } catch (e) {
        res.status(500);
        res.send("Internal server error");
    }
};

const editdata = async (req, res) => {
    let { name, bio } = req.body;


    if (!name || !bio) {
        return res.send('All fields are mandatory');
    }

    try {
        let imgdata = req.file.filename
        let updateData = { name, bio, imgdata };
        console.log(imgdata)


        let user = await usermodel.findByIdAndUpdate(req.params.id, updateData, { new: true });

        user.profilePic = "/instadp/img/" + req.file.filename; // Use the correct relative path
        await user.save();

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.redirect("/profile");
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal server error");
    }
};

const postdata = async (req, res) => {
    const { content } = req.body;

    try {
        let user = await usermodel.findOne({ email: req.user.email });
        let post = await postmodel.create({
            user: user._id,
            content: content
        });

        user.post.push(post._id);
        await user.save();
        res.redirect("/profile");
        console.log(post)
    }
    catch (e) {
        res.status(500);
        res.send("Internal server error")
    }
};

const postedit = async (req, res) => {
    let { postcon } = req.body;
    try {
        // let finduser = await postmodel.findOne({ _id: req.params.id });
        // if (!finduser) {
        //     res.send('failed to edit post')
        // }
      
            let updateuser = await postmodel.findByIdAndUpdate(req.params.id, content, { new: true });
            res.redirect("/profile")
    
    }
    catch (e) {
        res.status(500)
        res.send("Internal server error")
    }
}







const logout = (req, res) => {
    res.cookie("token", "", { expires: new Date(0) });
    res.redirect("/login");
}

module.exports = { router, postdata, postedit, sendpost, editdata, profile, home, chat, editpro, search, signin, register, login, loginuser, logout };
