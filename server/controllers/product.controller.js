const Product = require('../models/product.model');
const ObjectId = require('mongoose').Types.ObjectId;
const errorHandler = require("./errors.server.controller");
const p = require('path');
const fs = require('fs');
const Url = require('../utils/api.conf').urlProducts;


class ProductController {
    post(req, res) {
        Product.create([req.body], (err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else res.json(r);
        });
    }
    get(req, res) {
        Product.find({},{},{'createdAt': -1}).populate("category").exec((err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else res.json(r);
        });
    }
    put(req, res) {
        Product.findOneAndUpdate({
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

        Product.findByIdAndDelete({
            _id: new ObjectId(req.params.id)
        }, (err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else res.json(r);
        });

    }
    guardarImagen(req, res) {
        try {
          let path = req.files.product.path;
          let type = req.files.product.type;
          let size = req.files.product.size;
          let regex = new RegExp(/^image\/(png|jpg|jpeg)$/gm);
          if (regex.exec(type)) {
            if (size <= 2e7) {
              let name = `${Math.round(Math.random() * 1e20).toString()}${p.extname(path)}`;
              let newPath = p.join(__dirname, Url, name);
              let is = fs.createReadStream(path);
              let os = fs.createWriteStream(newPath);
              is.pipe(os);
              is.on('end', () => fs.unlinkSync(path));
              res.json({
                success: "Imagen subida con éxito.",
                imageName: name
              });
            } else res.json({
              error: "El archivo no se ha subido. [FAIL:Size]",
              code: "El archivo pesa más de 20MB, el peso debe ser menor"
            });
          } else res.json({
            error: "El archivo no se ha subido. [FAIL:Type]",
            code: "El tipo del archivo no es correcto"
          });
        } catch (ex) {
          res.json({
            error: "El archivo no se ha subido. [FAIL:fs-error]",
            code: ex
          });
        }
      }
}

module.exports = new ProductController;