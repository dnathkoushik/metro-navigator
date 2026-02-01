const mongoose = require('mongoose');

const stationSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    lines: [{
        line: {
            type: String,
            required: true
        },
        sequence: {
            type: Number,
            required: true
        }
    }],
    isInterchange: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Station', stationSchema);
