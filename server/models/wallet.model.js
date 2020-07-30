'use strict';

/**
 * Module dependencies.
 */
var dataTables = require('mongoose-datatables')
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Wallet Schema
 */
var WalletSchema = new Schema({
    type: {
        type: String,
        trim: true,
        required: "type is required"
    },
    quantity: {
        type: Number,
        required: "quantity is required"
    },
    after: {
        type: Number,
        required: "after is required"
    },
    before: {
        type: Number,
        required: "before is required"
    },
    reason: {
        type: String,
        trim: true,
        required: "reason is required"
    }
}, {
        timestamps: true
});
WalletSchema.plugin(dataTables);
const model = mongoose.model('Wallet', WalletSchema);

module.exports = model;