const mongoose = require('mongoose');

const citySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    state: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    totalLines: {
        type: Number,
        default: 0
    },
    totalStations: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('City', citySchema);
