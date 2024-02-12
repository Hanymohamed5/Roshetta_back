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
        const token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });
        await newUser.save();
        done(null, newUser)
        console.log(newUser,token);
    } catch (error) {
        done(error, false)
    }
}
));

//passport apple

/*passport.use(new appleTokenStrategy({
   clientID: process.env.apple_clientID,
   teamID: process.env.teamID,
   keyID: process.env.keyID,
}, async (req,accessToken, refreshToken, idToken, profile, done) => {
   try {

   } catch (error) {
       done(error, false)
   }
}
));*/