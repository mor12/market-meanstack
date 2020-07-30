const Employee = require('../models/employee.model');
const Compra = require('../models/compra.model');
const Schedule = require('../models/schedule.model');
const ObjectId = require('mongoose').Types.ObjectId;
const errorHandler = require("./errors.server.controller");
const p = require('path');
const fs = require('fs');
const Url = require('../utils/api.conf').urlEmployee;

class EmployeeController {
    updateInfoFromJson(req, res) {
        var employees_list = JSON.parse(fs.readFileSync(p.join(__dirname, "../utils/", "employees.json"), 'utf8'));

        Employee.find().exec((err, r) => {

            var employees_db = r;

            var employees_not_found  = [];

            employees_db.forEach(employee_db => {
                var employee_selected = employees_list.filter(a => a.email == employee_db.email)[0];
                if (employees_list.filter(a => a.email == employee_db.email).length == 0) {
                    employees_not_found.push(employee_db);
                } else {

                    Employee.findOneAndUpdate({
                        _id:  new ObjectId(employee_db._id)
                    }, {
                        $set: {code_erp: employee_selected.erp_code}
                    }).exec((err, r) => {
                        if (err) console.log(err)
                    })

                }

            });

            res.json(employees_not_found)
        })
    }
    post(req, res) {
        Employee.create([req.body], (err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else res.json(r);
        });
    }
    get(req, res) {
        Employee.find().exec((err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else res.json(r);
        });
    }
    put(req, res) {
        Employee.findOneAndUpdate({
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

        Employee.findByIdAndDelete({
            _id: new ObjectId(req.params.id)
        }, (err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else res.json(r);
        });

    }
    getById(req, res) {
        Employee.findById(req.params.id, (err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else res.json(r);
        })
    }
    getByQr(req, res) {
        Employee.findOne({
            qr_code: req.params.qr
        }).exec((err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else res.json(r);
        })
    }
    guardarImagen(req, res) {
        try {
            let path = req.files.employee.path;
            let type = req.files.employee.type;
            let size = req.files.employee.size;
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

    getComprasActual(req, res) {
        const date = new Date();
        let dateInit;
        let dateFinish;

        if (date.getDate() > 14 &&
            date.getDate() < new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()) {
            dateInit = new Date(`${date.getMonth() + 1}/15/${date.getFullYear()}`).setHours(0);
            dateFinish = new Date(date.getFullYear(), date.getMonth() + 1, 0).setHours(-1);
        } else {
            dateInit = new Date(date.getFullYear(), date.getMonth() , 0).setHours(1);
            dateFinish = new Date(`${date.getMonth() + 1}/14/${date.getFullYear()}`).setHours(23);
        }

        Compra.find({
            employee:  req.params.id,
            createdAt: {
                $gte: new Date(dateInit),
                $lte: new Date(dateFinish)
            }
        }, {},{
            sort: { createdAt: -1}
        }).populate('employee').exec((err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else res.json(r);
        })
    }

    getComprasActualFilterDate(req, res) {
        const date = new Date();
        let dateInit = new Date(new Date(req.params.date_init).setHours(1));
        let dateFinish = new Date(new Date(req.params.date_finish).setHours(23));

        Compra.find({
            employee:  req.params.id,
            createdAt: {
                $gte: new Date(dateInit),
                $lte: new Date(dateFinish)
            }
        }, {},{
            sort: { createdAt: -1}
        }).populate('employee').exec((err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else res.json(r);
        })
    }


    getComprasActualByExt(req, res) {
        const date = new Date();
        let dateInit;
        let dateFinish;
        const p_ext = req.params.ext
        if (date.getDate() > 14 &&
            date.getDate() < new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()) {
            dateInit = new Date(`${date.getMonth() + 1}/15/${date.getFullYear()}`).setHours(0);
            dateFinish = new Date(date.getFullYear(), date.getMonth() + 1, 0).setHours(-1);
        } else {
            dateInit = new Date(date.getFullYear(), date.getMonth(), 0).setHours(1);
            dateFinish = new Date(`${date.getMonth() + 1}/14/${date.getFullYear()}`).setHours(23);
        }

        dateInit = "2019-09-30T00:00:00";
        dateFinish = "2019-10-15T23:59:00";
        Employee.find({
            ext: req.params.ext
        }).findOne((err, r) => {

            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else if (!r) {
                return res.status(400).send({
                    message: "Not found"
                });
            }else {
                Compra.find({
                    employee:  r.id,
                    createdAt: {
                        $gte: new Date(dateInit),
                        $lte: new Date(dateFinish)
                    }
                }, {},{
                    sort: { createdAt: -1}
                }).populate('employee').exec((err, r) => {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {

                        Schedule.find({
                            ext: parseInt(p_ext),
                            day: {
                                $gte: new Date(new Date().setHours(1)),
                                $lte: new Date(new Date().setHours(23))
                            }
                        }).exec((err, rschedule) => {

                            if (rschedule.length > 0) {
                                r.reservation = rschedule;
                            } else {
                                r.reservation = [];
                            }

                            const rep = {
                                buys: r,
                                reservations: rschedule
                            }
                            res.json(rep);
                        })

                    }
                })
            }

        })

    }

    filterdateext(req, res) {

        let dateInit = new Date(`${req.params.dateinit} 00:00:00`);
        let dateFinish = new Date(`${req.params.datefinish} 23:59:00`);
        const p_ext = req.params.ext



        Employee.find({
            ext: req.params.ext
        }).findOne((err, r) => {

            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else if (!r) {
                return res.status(400).send({
                    message: "Not found"
                });
            }else {
                Compra.find({
                    employee:  r.id,
                    createdAt: {
                        $gte: dateInit,
                        $lte: dateFinish
                    }
                }, {},{
                    sort: { createdAt: -1}
                }).populate('employee').exec((err, r) => {

                    return res.json(r)
                })
            }

        })

    }

    getByExtOrName(req, res) {

        let options = {};

        if (parseInt(req.params.text)) {
            options = {
                "ext": req.params.text,
            }
        } else {
            options = {
                "name": {
                    $regex: '.*' + req.params.text + '.*'
                }
            }
        }
        Employee.find(options).exec((err, r) => {
            if (err) {
                console.log(err);
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else return res.json(r);
        })

    }

    setQRCode(req, res) {

        Employee.findOneAndUpdate({
            ext: req.params.ext
        }, { $set: {
            qr_code: req.params.qr }
        }).exec((err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else return res.json(r);
        })

    }
    compareEmployees(req, res) {
        var employees_list = JSON.parse(fs.readFileSync(p.join(__dirname, "../utils/", "employees.json"), 'utf8'));

        Employee.find().exec((err, r) => {

            var employees_db = r;

            var employees_not_found  = [];

            employees_db.forEach(employee_db => {
                var employee_selected = employees_list.filter(a => a.email == employee_db.email)[0];
                if (employees_list.filter(a => a.email == employee_db.email).length == 0) {
                    employees_not_found.push(employee_db);
                } else {

                    Employee.findOneAndUpdate({
                        _id:  new ObjectId(employee_db._id)
                    }, {
                        $set: {code_erp: employee_selected.erp_code}
                    }).exec((err, r) => {
                        if (err) console.log(err)
                    })

                }

            });

            res.json(employees_not_found)
        })
    }
}

module.exports = new EmployeeController;