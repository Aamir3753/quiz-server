const express = require("express");
const Router = express.Router();
const nodemailer = require("nodemailer");
const config = require("../config");
const { google } = require("googleapis");
const jwt = require('jsonwebtoken');
const OAuth2 = google.auth.OAuth2;

const Users = require("../models/user");


const oauth2Client = new OAuth2(
    config.google.clientId,
    config.google.clientSecret,
    "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
    refresh_token: config.google.refreshToken
});


Router.post("/setPassword", (req, res, next) => {
    jwt.verify(req.body.token, config.secretKey, { ignoreExpiration: false }, (err, payload) => {
        if (err) return next(err);
        Users.findById(payload._id, (err, user) => {
            if (err) return next(err);
            if (!user) {
                let error = Error();
                error.message = "User not found";
                error.status = 404;
                return
            }
            user.setPassword(req.body.password, (err, result) => {
                if (err) return next(err);
                user.save((err)=>{
                    if(err) return next(err);
                    res.json({success:true,password:"Password reset done!"})
                })
            })
        })
    })
})

Router.post("/sendLink", (req, res, next) => {

    Users.findOne({ username: req.body.email }, async (err, user) => {
        if (err) return next(err);
        if (!user) {
            let error = new Error();
            error.message = "User not found"
            error.status = 404;
            next(error);
            return;
        }
        if (user.facebook) {
            let error = new Error();
            error.status = 403
            error.message = "You are authenticated using facebook Authentication"
            next(error);
            return;
        }
        const passwordResetToken = jwt.sign({ _id: user._id }, config.secretKey, { expiresIn: 900 })
        const tokens = await oauth2Client.refreshAccessToken()
        const accessToken = tokens.credentials.access_token
        const email = req.body.email;
        const mailOptions = {
            from: "Aamir",
            to: email,
            subject: "Reset Password Link",
            html: `
                    <h1>Quiz_Portal</h1>
                    <div>
                        <h2>Click Link the link to reset the password</h2>
                        <a href="http://localhost:3000/resetPassword/${passwordResetToken}">Reset Password</a>
                    </div>
            `
        }
        const mailTranspoter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "ars3753669@gmail.com",
                clientId: config.google.clientId,
                clientSecret: config.google.clientSecret,
                refreshToken: config.google.refreshToken,
                accessToken: accessToken
            }
        })
        mailTranspoter.sendMail(mailOptions, (err, result) => {
            if (err) return next(err);
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 200;
            res.json({ success: true, result })
        })
    })
})

module.exports = Router
