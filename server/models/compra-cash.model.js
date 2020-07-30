'use strict';

/**
 * Module dependencies.
 */
var dataTables = require('mongoose-datatables')
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Compra Schema
 */
var CompraCashSchema = new Schema({
    products: [],
    user: [{
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId
    }],
    total: {
        type: Number,
        required: "price is required"        
    },
}, {
        timestamps: true
});
CompraCashSchema.plugin(dataTables);
const model = mongoose.model('CompraCash', CompraCashSchema);

module.exports = model;