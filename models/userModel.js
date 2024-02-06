const mongoose = require('mongoose');
const sequencing = require("../config/sequencing");

const userSchema = new mongoose.Schema(
    {
        //_id: Number,
         name: {
            type: String,
            //required: true,
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
        image: {
            type: String
        },
        MedicalHistory: {
            type: {
                gender: Number,
                dateOfBirth: String,
                country_id: Number,
                city_id: Number,
                height: Number,
                weight: Number,
                isExerciseAvilable: Boolean,
                exerciseType: Number,
                isAnyHealthProblem: Boolean,
                medicine: [String],
                isPregnant: Boolean,
                isSmoker: Boolean
            },
            default: null
        },
        /*googleId: {
            type: String,
            unique: true,
        }*/
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