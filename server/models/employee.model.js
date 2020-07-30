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
var EmployeeSchema = new Schema({
    name: {
        type: String,
        default: "",
        trim: true,
        required: "name is required"
    },
    username: {
        type: String,
        trim: true,
        unique: true,
        required: "username is required"
    },
    email: {
        type: String,
        required: "email is required",
        trim: true,
        unique: true
    },
    ext: {
        type: Number,
        required: "Ext is required",
        trim: true,
        unique: true
    },
    code_erp: {
        type: String,
        // trim: true,
        // unique: true
    },
    qr_code: {
        type: String,
        trim: true,
        unique: true
    },
    limit: {
        type: Number,
        default: 150
    },
    type: {
        type: String,
        default: "contrato",
    },
    image_path: {
        type: String,
        default: "default_user.png",
    },
}, {
        timestamps: true
});
EmployeeSchema.plugin(dataTables);
const model = mongoose.model('Employee', EmployeeSchema);

module.exports = model;