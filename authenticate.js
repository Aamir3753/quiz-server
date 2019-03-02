const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const jwtStrategy = require("passport-jwt").Strategy;
const extractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const facebookStrategy = require("passport-facebook").Strategy;
const config = require("./config");

const Users = require("./models/user");

// Authenticate by local strategy
passport.use(new localStrategy(Users.authenticate()));

// Authenticate by jwt
passport.use(new jwtStrategy(
    {
        jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.secretKey
    },
    (payload, done) => {
        Users.findById(payload._id, (err, user) => {
            if (err) return done(err);
            done(null, user);
        })
    }
));

passport.use(new facebookStrategy({
    clientID: config.facebook.appId,
    clientSecret: config.facebook.facebookSecret
}, (accessToken, refreshToken, profile, done) => {
    Users.findOne({ facebook: profile.id }, (err, user) => {
        if (err) return done(err, false);
        if (!user) {
            const user = new Users({ facebook: facebook.id });
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;
            user.save((err, user) => {
                if (err) return done(err, false);
                done(null, user);
            })
            return;
        }
        done(null, user);
    })
}))

// getToken
module.exports.getToken = (user, expiresIn = 3600) => jwt.sign(user, config.secretKey, { expiresIn: expiresIn });

// Verify user via jwt
module.exports.verifyUser = passport.authenticate("jwt", { session: false });

// Verify Admin
module.exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin) return next();
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 401;
    res.json({ success: false, message: "Your are not authorized to access this route" });
}