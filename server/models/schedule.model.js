'use strict';

/**
 * Module dependencies.
 */
var dataTables = require('mongoose-datatables')
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Schedule Schema
 */
var ScheduleSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: "username is required",
    },
    ext: {
        type: Number,
        required: "ext is required",
    },
    food_time: {
        type: String,
        trim: true,
        required: "food_time is required",
    },
    day: {
        type: Date
    }
}, {
        timestamps: true
});
ScheduleSchema.plugin(dataTables);
const model = mongoose.model('Schedule', ScheduleSchema);

module.exports = model;