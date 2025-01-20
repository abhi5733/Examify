const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const UserModel = require("../models/user.model")
const auth = require("../middelwares/auth")
require("dotenv").config()




const userRouter = express.Router()

userRouter.get("/",auth, async (req, res) => {
    const { userID } = req.body
    console.log(req.body)
    
    try {
         const singleuser = await UserModel.findById(userID)
         if(singleuser){
            res.status(200).send({msg:"single user exists",data:singleuser})
         }
         else{
            res.status(404).send({msg:"user does not exists"})
         }
    } catch (error) {
        res.status(404).send({msg:error})
    }
})


userRouter.post("/register", async (req, res) => {
    const { name, phone_number, password, email } = req.body
    console.log(name,email,password,phone_number)

    try {
        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                res.send(`Registration Error: - ${err}`)
            } else {
                let ExistingUser = await UserModel.findOne({ email: email })
                if (ExistingUser) {
                    res.send({ msg: "User Already Exist, Try Login" })
                } else {
                    const newD = new Date()
                    const year = newD.getFullYear()
                    let newUser = new UserModel({ name, email, phone_number, password: hash, year })
                    await newUser.save();
                    res.send({ msg: "Account create succesfully", user: newUser })
                }
            }
        })

    } catch (e) {
        console.log(e)
        res.send(`Registration Error: - ${e}`)
    }
})

userRouter.post("/google-login", async (req, res) => {
    const { googleId, email, name, image } = req.body;
    try {
        let user = await UserModel.findOne({ email });
        if (user) {
            if (user.isGoogleUser) {
                // Existing Google user
                const token = jwt.sign({ userID: user._id }, "pandal");
                return res.send({ msg: "Login success!", token, user });
            } else {
                return res.status(400).send({ msg: "Email exists for a non-Google user. Use password login." });
            }
        } else {
            // New Google user
            const newUser = new UserModel({
                googleId,
                email,
                name,
                image,
                isGoogleUser: true,
            });
            await newUser.save();
            const token = jwt.sign({ userID: newUser._id }, "pandal");
            res.status(201).send({ msg: "Google login success! New user created.", token, user: newUser });
        }
    } catch (error) {
        res.status(500).send({ msg: "Google login error", error });
    }
});

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            if (user.isGoogleUser) {
                return res.status(400).send({ msg: "Google user detected. Use Google login instead." });
            }
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    const token = jwt.sign({ userID: user._id }, "pandal");
                    res.send({ msg: `Login success! Welcome back ${user.name}`, token, user });
                } else {
                    res.status(401).send({ msg: "Wrong password" });
                }
            });
        } else {
            res.status(404).send({ msg: `Email ${email} does not exist. Try registering.` });
        }
    } catch (error) {
        res.status(500).send({ msg: "Error during login", error });
    }
});

module.exports = userRouter