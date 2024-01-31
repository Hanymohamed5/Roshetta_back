const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    seq: {
        type: Number,
        required: true
    }
});

const Counter = mongoose.model('Counter', CounterSchema);

const getSequenceNextValue = (seqName) => {
    return Counter.findByIdAndUpdate(
        { "_id": seqName },
        { "$inc": { "seq": 1 } },
        { new: true, upsert: true }
    )
    .exec()
    .then((counter) => {
        if (counter) {
            return counter.seq;
        } else {
            return null;
        }
    })
    .catch((error) => {
        throw error;
    });
};


const insertCounter = (seqName) => {
    const newCounter = new Counter({ _id: seqName, seq: 1 });
    return new Promise((resolve, reject) => {
    newCounter.save()
        .then(data => {
            resolve(data.seq);
        })
        .catch(err => reject(error));
    });
}
module.exports = {
    Counter,
    getSequenceNextValue,
    insertCounter
}

