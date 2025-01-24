const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const UserModel = require("../models/user.model")
const QuizModel = require("../models/quiz.model.js")
const { OAuth2Client } = require('google-auth-library');
const auth = require("../middlewares/auth.js")
require("dotenv").config()



const client = new OAuth2Client(process.env.ClientID);
const userRouter = express.Router()

// userRouter.get("/",auth, async (req, res) => {
//     const { userID } = req.body
//     console.log(req.body)
    
//     try {
//          const singleuser = await UserModel.findById(userID)
//          if(singleuser){
//             res.status(200).send({msg:"single user exists",data:singleuser})
//          }
//          else{
//             res.status(404).send({msg:"user does not exists"})
//          }
//     } catch (error) {
//         res.status(404).send({msg:error})
//     }
// })


userRouter.post("/register", async (req, res) => {
    const { name,  password, email } = req.body
    console.log(name,email,password)

    try {
        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                res.status(400).send({ msg: "Something Went Wrong" })
            } else {
                let ExistingUser = await UserModel.findOne({ email: email })
                if (ExistingUser) {
                    res.status(400).send({ msg: "User Already Exist, Try Login" })
                } else {
                    // const newD = new Date()
                    // const year = newD.getFullYear()
                    let newUser = new UserModel({ name, email , password: hash })
                    await newUser.save();
                    res.status(200).send({ msg: "Account create succesfully", user: newUser })
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
    // console.log(req.body,"body")
    const { email, password, token } = req.body; // Accept both email/password and Google token

    try {
        
        // Check if this is a Google login
        if (token) {
            // Verify the Google token
       
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.ClientID,
            });

            const payload = ticket.getPayload();

            console.log(payload,"payload")

            const { email, name, picture } = payload;

            // Check if the user exists in the database
            let user = await UserModel.findOne({ email });

            if (!user) {
                // If user doesn't exist, create a new user with Google details
                user = new UserModel({
                    email,
                    name,
                    isGoogleUser: true,
                });
                await user.save();
            } else if (!user.isGoogleUser) {
                return res.status(400).send({
                    msg: "This email is registered with a password. Use email/password login.",
                });
            }

            // Generate and send JWT token
            const tokens = jwt.sign({ userID: user._id }, "pandal");
            return res.status(200).send({
                msg: `Google login successful! Welcome, ${user.name}`,
                tokens,
                user,
            });
        }

        // Normal login (email/password)
        if (email && password) {
            const user = await UserModel.findOne({ email });
            if (user) {
                if (user.isGoogleUser) {
                    return res.status(400).send({
                        msg: "Google user detected. Use Google login instead.",
                    });
                }
                bcrypt.compare(password, user.password, (err, result) => {
                    if (result) {
                        const tokens = jwt.sign({ userID: user._id }, "pandal");
                        res.status(200).send({
                            msg: `Login success! Welcome back ${user.name}`,
                            tokens,
                            user,
                        });
                    } else {
                        res.status(401).send({ msg: "Wrong password" });
                    }
                });
            } else {
                res.status(404).send({
                    msg: `Email ${email} does not exist. Try registering.`,
                });
            }
        } else {
            res.status(400).send({
                msg: "Invalid request. Provide either googleToken or email/password.",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Error during login", error });
    }
});




module.exports = userRouter ;