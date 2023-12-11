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

        if (user) return done(null, user)

        // if new account
        const newUser = new User({
            provider: 'google',
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
        })

        await newUser.save()

        done(null, newUser)
    } catch (error) {
        done(error, false)
    }
}
));

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
        await newUser.save();
        done(null, newUser)
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