const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        provider: {
            type: String,
            enum: ['google', 'facebook', 'apple'],
            default: 'normal'
        },
        isOnline: {
            type: Boolean,
            default: false
        },
        googleId: {
            type: String,
            unique: true,
        }
        , name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            //required:true,
            unique: true,
            lowercase: true,
        },
        /*mobile:{
            type:String,
            required:true,
            unique:true,
            default:null
        },*/
        /*password:{
            type:String,
            required:true,
        },*/
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        role: {
            type: String,
            required: true,
            default: "user"
        },
        profilePic: {
            type: String
        },
        facebookId: {
            type: String,
        },
        // appleId: {
        //   type: String,
        // },
        MedicalHistory: {
            gender: Number,
            birthDat: Date,
            weight: Number,
            height: Number,
            medicine: String,
            healthProblem: {
                mainProblem: String,
                subProblem: String
            }
        }
    },
    {
        timestamps: true,
    }
);

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;