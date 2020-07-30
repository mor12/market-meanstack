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
var CompraSchema = new Schema({
    products: [],
    combos: [{
        ref: 'Combo',
        type: mongoose.Schema.Types.ObjectId
    }],
    employee: [{
        ref: 'Employee',
        type: mongoose.Schema.Types.ObjectId
    }],
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
CompraSchema.plugin(dataTables);
const model = mongoose.model('Compra', CompraSchema);

module.exports = model;