const passport = require('passport');
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const facebookTokenStrategy = require('passport-facebook-token');
const appleTokenStrategy = require('passport-apple-token');
const User = require('../models/userModel')
const dotenv = require('dotenv');
dotenv.config({ path: 'config.env' });
const factory = require('../controllers/handlersFactory');
const createToken = require('../utils/createToken');
const jwt = require('jsonwebtoken');

// passport Google
passport.use(new GooglePlusTokenStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // check whether this current user exists in your database
        const user = await User.findOne({
            googleId: profile.id,
            provider: "google"
        });

        if (user) {
            // If the user exists, return the user
            return done(null, user);
        }

        // if new account
        const newUser = new User({
            provider: 'google',
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
        });
        // Attempt to save the new user, handling duplicate key error
        try {
            const savedUser = await newUser.save();
            const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });

            done(null, savedUser);
            console.log(savedUser, token);
        } catch (error) {
            // Handle duplicate key error
            if (error.code === 11000) {
                // If it's a duplicate key error, retrieve and return the existing user
                const existingUser = await User.findOne({ googleId: profile.id });
                done(null, existingUser);
            } else {
                // Handle other errors
                done(error, false);
            }
        }
    } catch (error) {
        done(error, false);
    }
}));


// passport Facebook
passport.use(new facebookTokenStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_SECRET_KEY,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // check whether this current user exists in your database
        const user = await User.findOne({
            facebookId: profile.id,
            provider: "facebook"
        });

        if (user) return done(null, user)

        // if new account
        const newUser = new User({
            provider: 'facebook',
            facebookId: profile.id,
            name: profile.displayName,
            //email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
        });
        // Attempt to save the new user, handling duplicate key error
        try {
            const savedUser = await newUser.save();
            const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });

            done(null, savedUser);
            console.log(savedUser, token);
        } catch (error) {
            // Handle duplicate key error
            if (error.code === 11000) {
                // If it's a duplicate key error, retrieve and return the existing user
                const existingUser = await User.findOne({ facebookId: profile.id });
                done(null, existingUser);
            } else {
                // Handle other errors
                done(error, false);
            }
        }
    } catch (error) {
        done(error, false)
    }
}
));

/*passport.use(new appleTokenStrategy({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
}, async (accessToken, refreshToken, idToken, profile, done) => {
    try {
        // check whether this current user exists in your database
        const user = await User.findOne({
            appleId: profile.sub, // assuming sub is the Apple user ID
            provider: 'apple',
        });

        if (user) return done(null, user);

        // if new account
        const newUser = new User({
            provider: 'apple',
            appleId: profile.sub, // assuming sub is the Apple user ID
            name: profile.email, // you may use a different property based on your needs
            // other relevant properties from the Apple profile
        });

        // Attempt to save the new user, handling duplicate key error
        try {
            const savedUser = await newUser.save();
            const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN,
            });

            done(null, savedUser);
            console.log(savedUser, token);
        } catch (error) {
            // Handle duplicate key error
            if (error.code === 11000) {
                // If it's a duplicate key error, retrieve and return the existing user
                const existingUser = await User.findOne({ appleId: profile.sub });
                done(null, existingUser);
            } else {
                // Handle other errors
                done(error, false);
            }
        }
    } catch (error) {
        done(error, false);
    }
}));*/