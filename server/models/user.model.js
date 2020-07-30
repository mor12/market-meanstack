'use strict';

/**
 * Module dependencies.
 */
var dataTables = require('mongoose-datatables')
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Employee Schema
 */
var UserSchema = new Schema({
    password: {
        type: String,
        default: "",
        trim: true,
        required: "name is required"
    },
    email: {
        type: String,
        required: "email is required",
        trim: true,
        unique: true
    },
    rol: {
        type: String,
        required: "Rol is required",
        trim: true,
    },
    status: {
        type: String,
        default: "Enable"
    },
    erp_code: {
        type: String,
    },
}, {
        timestamps: true
});
UserSchema.plugin(dataTables);
const model = mongoose.model('User', UserSchema);

module.exports = model;