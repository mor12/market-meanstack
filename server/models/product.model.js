'use strict';

/**
 * Module dependencies.
 */
var dataTables = require('mongoose-datatables')
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
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
    price: {
        type: Number,
        required: "price is required"        
    },
    quantity: {
        type: Number,
    },
    rating: {
        type: Number,
    },
    image_path: {
        type: String,
        default: "default_food.jpg",
    },
    description: {
        type: String,
        default: "",
    },
}, {
        timestamps: true
});
ProductSchema.plugin(dataTables);
const model = mongoose.model('Product', ProductSchema);

module.exports = model;