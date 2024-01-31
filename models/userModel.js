const mongoose = require('mongoose');
const sequencing = require("../config/sequencing");

const userSchema = new mongoose.Schema(
    {
        //_id: Number,
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
);

/*userSchema.pre("save", function (next) {
    let doc = this;
    sequencing.getSequenceNextValue("user_id").
    then(counter => {
        //console.log("asdasd", counter);
        if(!counter) {
           sequencing.insertCounter("user_id")
            .then(counter => {
                doc._id = counter;
                console.log(doc)
                next();
            })
            .catch(error => next(error))
        } else {
            doc._id = counter;
            next();
        }
    })
    .catch(error => next(error))
});*/

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;