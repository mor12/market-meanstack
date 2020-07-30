const Compra = require('../models/compra.model');
const Employee = require('../models/employee.model');
const ObjectId = require('mongoose').Types.ObjectId;
const errorHandler = require("./errors.server.controller");
const fs = require('fs');
const p = require('path');
const request = require("request");
const puppeteer = require('puppeteer');


class CompraController {
    post(req, res) {
        Compra.create([req.body], (err, r) => {
            if (err ) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(r);

                Employee.findById(r[0].employee).exec((err, employee_res) => {
                    if (!err) {
                        let path_tempalte = p.join(__dirname, '../utils/mail-template.html')
                        let readStream = fs.createReadStream(path_tempalte);

                        var email_tempalte = '';

                        readStream.on('data', function (chunk) {
                            email_tempalte += chunk;
                        }).on('end', function () {
                            // console.log(email_tempalte);
                            let product_cols = '';
                            // r[0].products.forEach(product => {
                            //     product_cols += `<li class="item">
                            //                 <div class="col col-1">${product.name}</div>
                            //                 <div class="col col-1">${product.price.toFixed(2)}</div>
                            //             </li>`;
                            // });
                            r[0].products.forEach(product => {
                                product_cols += `<tr class="item">
                                            <td>${product.name}</td>
                                            <td>${product.price.toFixed(2)}</td>
                                        </tr>`;
                            });

                            // set products
                            email_tempalte = email_tempalte.replace('{products}', product_cols);
                            // set created date
                            email_tempalte = email_tempalte.replace('{created}',r[0].createdAt.toDateString());
                            // set ref
                            email_tempalte = email_tempalte.replace('{ref}', r[0]._id);
                            // set total
                            email_tempalte = email_tempalte.replace('${total}', r[0].total.toFixed(2))


                            var options = {
                                method: 'POST',
                                url: 'http://directv.red4g.net/api/send/email',
                                headers: {
                                    'Postman-Token': '05ef36e5-bf26-463e-86d1-ea44827bfa30',
                                    'cache-control': 'no-cache',
                                    'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                                },
                                formData: {
                                    from: 'cocina@red4g.net',
                                    // to: 'jmelgar@red4g.net',
                                    to: employee_res.email,
                                    body: email_tempalte,
                                    subject: `Compra `,
                                    from_name: 'red5g market',
                                    to_name: ''
                                }
                            };

                            request(options, function (error, response, body) {
                                if (error) console.log(error)

                                console.log(body);
                            });
                            // var htmlInvoice = fs.createWriteStream(p.join(__dirname, '../disk/invoice.html'));

                            // htmlInvoice.once('open', function(fd) {
                            //     var html = email_tempalte;

                            //     htmlInvoice.end(html);
                            //   });

                            //   (async () => {
                            //     const browser = await puppeteer.launch();
                            //     const page = await browser.newPage();
                            //     await page.goto('http://172.16.20.239/file/invoice/invoice.html', {
                            //       //
                            //     });
                            //     await page.screenshot({
                            //       path: p.join(__dirname, '../disk/invoice.png'),
                            //       fullPage: true,
                            //     });

                            //     await browser.close();



                            //   })();




                        });
                    }
                })

            }
        });
    }
    get(req, res) {
        Compra.find().populate('employee').populate('user').exec((err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else res.json(r);
        });
    }
    put(req, res) {
        Compra.findOneAndUpdate({
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

        Compra.findByIdAndDelete({
            _id: new ObjectId(req.params.id)
        }, (err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else res.json(r);
        });

    }
    getComprasAttService(req, res) {

        let filterOption = {
            createdAt: {
                $gte: req.body.dateInit,
                $lte: req.body.dateFinish
            },
        };

        if (req.body.id) {
            filterOption = {
                createdAt: {
                    $gte: req.body.dateInit,
                    $lte: req.body.dateFinish
                },
                employee: req.body.id
            }
        }

        Compra.find(filterOption).populate('employee').exec((err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else return res.json(r);
        })

    }

    generalDetail() {
        Compra.aggregate([{
            $group: {
                _id: "$employee",
                totalAmount: {
                    $sum: "$total"
                },
                count: {
                    $sum: 1
                }
            }
        }]).exec((err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else return res.json(r);
        })
    }
}

module.exports = new CompraController;