'use strict';

/**
 * Module dependencies.
 */
var dataTables = require('mongoose-datatables')
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Category Schema
 */
var CategorySchema = new Schema({
    name: {
        type: String,
        default: "",
        trim: true,
        required: "name is required",
    },
    description: {
        type: String,
        default: "",
        trim: true,
        required: "description is required",
    },
    available_time: {
        type: String,
        trim: true,
    }
}, {
        timestamps: true
});
CategorySchema.plugin(dataTables);
const model = mongoose.model('Category', CategorySchema);

module.exports = model;