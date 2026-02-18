const mongoose = require('mongoose');

const stationSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
        required: true
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

// Compound unique index: station name must be unique within a city
stationSchema.index({ name: 1, city: 1 }, { unique: true });

module.exports = mongoose.model('Station', stationSchema);
