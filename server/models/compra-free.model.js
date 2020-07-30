'use strict';

/**
 * Module dependencies.
 */
var dataTables = require('mongoose-datatables')
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Compra Free Schema
 */
var CompraFreeSchema = new Schema({
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
CompraFreeSchema.plugin(dataTables);
const model = mongoose.model('CompraFree', CompraFreeSchema);

module.exports = model;