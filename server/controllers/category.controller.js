const Category = require('../models/category.model');
const ObjectId = require('mongoose').Types.ObjectId;
const errorHandler = require("./errors.server.controller");

class CategoryController {
    post(req, res) {
        Category.create([req.body], (err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else res.json(r);
        });
    }
    get(req, res) {
        Category.find().exec((err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else res.json(r);
        });
    }
    put(req, res) {
        Category.findOneAndUpdate({
            _id: new ObjectId(req.body._id)
        }, req.body, (err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else res.json(r);
        });
    }
    delete(req, res) {
        Category.findByIdAndDelete({
            _id: new ObjectId(req.params.id)
        }, (err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else res.json(r);
        });

    }
}

module.exports = new CategoryController;