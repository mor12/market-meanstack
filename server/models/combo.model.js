'use strict';

/**
 * Module dependencies.
 */
var dataTables = require('mongoose-datatables')
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Combo Schema
 */
var ComboSchema = new Schema({
    name: {
        type: String,
        default: "",
        trim: true,
        required: "name is required"
    },
    category: {
        ref: 'Category',
        required: 'category is required',
        type: mongoose.Schema.Types.ObjectId
    },
    products: [{
        ref: 'Product',
        required: 'category is required',
        type: mongoose.Schema.Types.ObjectId
    }],
    price: {
        type: Number,
        required: "price is required"        
    },
    quantity: {
        type: Number,
    },
    image_path: {
        type: String,
        default: "default_food.jpg",
    },
}, {
        timestamps: true
});
ComboSchema.plugin(dataTables);
const model = mongoose.model('Combo', ComboSchema);

module.exports = model;