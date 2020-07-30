const Combo = require('../models/combo.model');
const ObjectId = require('mongoose').Types.ObjectId;
const errorHandler = require("./errors.server.controller");

class ComboController {
    post(req, res) {
        Combo.create([req.body], (err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else res.json(r);
        });
    }
    get(req, res) {
        Combo.find().exec((err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else res.json(r);
        });
    }
    put(req, res) {
        Combo.findOneAndUpdate({
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

        Combo.findByIdAndDelete({
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

module.exports = new ComboController;