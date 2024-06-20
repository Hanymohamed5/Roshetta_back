const mongoose = require('mongoose');
const sequencing = require("../config/sequencing");

//const autoIncrement = require('mongoose-sequence')(mongoose);

const CenterSchema = new mongoose.Schema(
  {
    //_id: Number,
    logo: {
      type: String
    },
    imageCover: {
      type: String,
      //required: [true, 'Product Image cover is required'],
    },
    name: {
      type: String,
      trim: true,
      unique: [true, 'Center must be unique'],
      minlength: [2, 'To short Center name'],
      maxlength: [32, 'To long Center name'],
    },
    ratingsAverage: {
      type: Number,
      min: [1, 'Rating must be above or equal 1.0'],
      max: [5, 'Rating must be below or equal 5.0'],
      set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
    },
  centerPhotos: [String],
    specilization: {
      type: [String],
      trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    trim: true,
    max: [200000, 'Too long product price'],
  },
  location: {
      type: String,
      trim: true,
      minlength: [2, 'To short city name'],
      maxlength: [32, 'To long city name'],
  },
  isfavourite: {
    type: Boolean,
    default: false,
},
  },
  {
    toJSON: { 
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    },
    toObject: { virtuals: true }
  }
);

CenterSchema.virtual("doctors", {
  ref: "Doctor",
  foreignField: "center",
  localField: "_id"
}
);

CenterSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'center',
  localField: '_id',
});

const setImageURL = (doc) => {
  if (doc.logo) {
    const imageUrl = `${process.env.BASE_URL}/centers/${doc.logo}`;
    doc.logo = imageUrl;
  }
  if (doc.centerPhotos) {
    const imagesList = [];
    doc.centerPhotos.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/centerProfile/${image}`;
      imagesList.push(imageUrl);
    });
    doc.centerPhotos = imagesList;
  }
};
// findOne, findAll and update
CenterSchema.post('init', (doc) => {
  setImageURL(doc);
});

// create
CenterSchema.post('save', (doc) => {
  setImageURL(doc);
});

/*CenterSchema.pre("save", function (next) {
  let doc = this;
  sequencing.getSequenceNextValue("Center_id").
  then(counter => {
      //console.log("asdasd", counter);
      if(!counter) {
         sequencing.insertCounter("Center_id")
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

module.exports = mongoose.model('Center', CenterSchema);