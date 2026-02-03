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
    },
    x: {
        type: Number,
        required: true,
        default: 0
    },
    y: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Station', stationSchema);
