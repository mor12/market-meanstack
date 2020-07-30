const Compra = require('../models/compra.model');
const CompraCash = require('../models/compra-cash.model');
const Employee = require('../models/employee.model');
const errorHandler = require("./errors.server.controller");
var json2xls = require('json2xls');
const fs = require('fs');
const request = require("request");

class ReportController {

    stadisticsByEmployeeSchedule(req, res) {
        const today = new Date().toISOString()
        var options = {
            method: 'POST',
            url: 'https://directv.red4g.net/api/v1/employees/scheduled?api_token=u16W80VsSms5Psqsay6XKMaNeIrLmfW9moYvQ071d4xmeV5NT83mGiLaC4q7',
            headers: {
                'Postman-Token': '05ef36e5-bf26-463e-86d1-ea44827bfa30',
                'cache-control': 'no-cache',
                'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
            },
            formData: {
                from: new Date(req.params.date_init).toISOString(),
                to: new Date(req.params.date_finish).toISOString()
            }
        };

        request(options, function (error, response, body) {
            if (error) console.log(error)

            const employees_escalon = JSON.parse(body).filter(
                a=> a.location_name == "Escalon" &&
                ( a.schedule_name !== "Libre" && a.schedule_name !== "Asueto/Vacacion"));

            const schedule_group = employees_escalon.reduce((r,a) => {
                r[a.schedule_name] = r[a.schedule_name] || {count: 0};
                r[a.schedule_name].count = r[a.schedule_name].count+1;
                r[a.schedule_name].start_time = a.start_time;
                r[a.schedule_name].end_time = a.end_time;
                return r
            }, Object.create(null))

            res.json(schedule_group);
        });
    }

    weekSalesReport(req, res) {

        var now = new Date();
        var daysOfYear = [];
        for (var d =new Date(new Date(new Date().setDate(new Date().getDate() - 8) ).setHours(0)); d <= now; d.setDate(d.getDate() + 1)) {
            daysOfYear.push(new Date(d).toLocaleDateString());
        }

        const date_init = new Date(daysOfYear[0])
        const date_finish = new Date(new Date(daysOfYear[daysOfYear.length -1]).setHours(23))

        Compra.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: date_init,
                        $lte: date_finish
                    }
                }
            },
            {
                $project: {
                  year: {$year: '$createdAt'},
                  month: {$month: '$createdAt'},
                  dayOfMonth: {$dayOfMonth: '$createdAt'},
                  total: 1,
                  createdAt: 1
                }
            },
            {
                $group: {
                  _id: {
                    year: '$year',
                    month: '$month',
                    dayOfMonth: '$dayOfMonth'
                  },
                  datecreated: { $last: "$createdAt"},
                  final_total: { $sum: "$total" },
                  count: {
                    $sum: 1
                  }
                }
            }, {
                $sort: {datecreated: 1},
            }
        ]).exec((err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else res.json(r);
        })

    }

    employeesSalesByHour(req, res) {
        let dateInit = new Date(new Date(req.params.date_init).setHours(1));
        let dateFinish = new Date(new Date(req.params.date_finish).setHours(23));
        Compra.aggregate([
            {
                $match: {
                   createdAt: {
                       $gte: dateInit,
                       $lte: dateFinish
                   }
               }
            }, {
                $project: {
                    hour: { $hour: "$createdAt"}
                }
            }, {
                $group: {
                    _id: "$hour",
                    count: { $sum: 1 },
                }
            }
       ]).exec((err, r) => {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else res.json(r);
       })
    }

    getHistorialActual(req, res) {
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
            createdAt: {
                $gte: new Date(dateInit),
                $lte: new Date(dateFinish)
            }
        }, {},{
            sort: { createdAt: -1}
        }).limit(parseInt(req.params.count)).populate('employee').exec((err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else res.json(r);
        })
    }

    getHistorialActualDateFilter(req, res) {
        const date = new Date();
        let dateInit = new Date(new Date(req.params.date_init).setHours(1));
        let dateFinish = new Date(new Date(req.params.date_finish).setHours(23));

        Compra.find({
            createdAt: {
                $gte: dateInit,
                $lte: dateFinish
            }
        }, {},{
            sort: { createdAt: -1}
        }).limit(parseInt(req.params.count)).populate('employee').exec((err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else res.json(r);
        })
    }

    getHistorialActualDateFilterCash(req, res) {
        const date = new Date();
        let dateInit = new Date(new Date(req.params.date_init).setHours(1));
        let dateFinish = new Date(new Date(req.params.date_finish).setHours(23));

        CompraCash.find({
            createdAt: {
                $gte: dateInit,
                $lte: dateFinish
            }
        }, {},{
            sort: { createdAt: -1}
        }).limit(parseInt(req.params.count)).exec((err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else res.json(r);
        })
    }

    getTotalCompra(req, res) {
        Compra.aggregate(
            [
              {
                $group:
                  {
                    _id: null,
                    counter: { $sum: "$total" }
                  }
              }
            ]
        ).exec((err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else res.json(r);
        })
    }

    getTotalCompraDateFilter(req, res) {

        let dateInit = new Date(new Date(req.params.date_init).setHours(1));
        let dateFinish = new Date(new Date(req.params.date_finish).setHours(23));

        Compra.aggregate(
            [
                { $match : {
                    createdAt: {
                        $gte: dateInit,
                        $lte: dateFinish
                    }
                 } },
              {
                $group:
                  {
                    _id: null,
                    counter: { $sum: "$total" }
                  }
              }
            ]
        ).exec((err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else res.json(r);
        })
    }
    getTotalCompraCashDateFilter(req, res) {

        let dateInit = new Date(new Date(req.params.date_init).setHours(1));
        let dateFinish = new Date(new Date(req.params.date_finish).setHours(23));

        CompraCash.aggregate(
            [
                { $match : {
                    createdAt: {
                        $gte: dateInit,
                        $lte: dateFinish
                    }
                 } },
              {
                $group:
                  {
                    _id: null,
                    counter: { $sum: "$total" }
                  }
              }
            ]
        ).exec((err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else res.json(r);
        })
    }

    generatePlanilla1(req, res) {
        let dateInit = new Date(`${req.params.date_init} 00:00:00`) ;
        let dateFinish = new Date(`${req.params.date_finish} 23:59:59`);

        Compra.find({
            createdAt: {
                $gte: dateInit,
                $lte: dateFinish
            }
        }, {},{
            sort: { createdAt: -1}
        }).populate('employee').exec((err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                var compras_list = r.filter(a => a.employee[0] !== undefined);
                console.log('no compras',  r.filter(a => a.employee[0] == undefined))
                Employee.find().exec((err, employees_res) => {

                    var listado_reporte = [];

                    employees_res.forEach(element => {

                        var codigos_planilla1 = [
                            'RED4G11',
                            'RED4G12',
                            'RED4G09',
                            'RED4G16',
                            'RED4G17',
                            'RED4G06',
                            'RED4G13',
                            'RED4G15',
                            'RED4G14',
                            'RED4G21',
                            'RED4G18',
                            'RED4G19',
                            'RED4G27',
                            'RED4G26',
                            'RED4G29',
                            'RED4G37',
                            'RED4G30',
                            'RED4G31',
                            'RED4G32',
                            'RED4G34',
                            'RED4G38',
                            'RED4G39',
                            'RED4G40',
                            'RED4G41',
                            'RED4G42',
                            'Red4G44',
                            'RED4G45',
                            'Red4G49',
                            'RED4G50',
                            'RED4G52',
                            'RED4G53',
                            'RED4GCOCINA01',
                            'RED4G54',
                            'RED4GCOCINA04',
                            'RED4GCOCINA05',
                            'RED4G55',
                            'RED4G61',
                            'RED4G62',
                            'RED4G63',
                            'RED4G84',
                            'RED4GCOCINA07',
                            'RED4G57',
                            'RED4GCOCINA08',
                        ]
                        console.log(compras_list);
                        var compras_empleado = compras_list.filter(a => a.employee[0].id == element.id);
                        var total_compra = compras_empleado.reduce((total, c) => total + c.total, 0);

                        var item_reporte = {
                            codigo_erp : element.code_erp,
                            nombre: element.name,
                            total_compra: parseFloat(total_compra).toFixed(2)
                        }
                        if(item_reporte.codigo_erp) {
                            console.log(codigos_planilla1.indexOf(item_reporte.codigo_erp.trim()))
                            if(codigos_planilla1.indexOf(item_reporte.codigo_erp.trim()) > -1) {
                                listado_reporte.push(item_reporte);
                            }
                        }



                    });

                    console.table(listado_reporte);

                    var xls = json2xls(listado_reporte);
                    res.json(listado_reporte)
                    fs.writeFileSync('planilla1.xlsx', xls, 'binary');

                })
            }
        })
    }


       generatePlanilla(req, res) {
        let dateInit = new Date(`${req.params.date_init} 00:00:00`) ;
        let dateFinish = new Date(`${req.params.date_finish} 23:59:59`);

        Compra.find({
            createdAt: {
                $gte: dateInit,
                $lte: dateFinish
            }
        }, {},{
            sort: { createdAt: -1}
        }).populate('employee').exec((err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                var compras_list = r.filter(a => a.employee[0] !== undefined);
                console.log('no compras',  r.filter(a => a.employee[0] == undefined))
                Employee.find().exec((err, employees_res) => {

                    var listado_reporte = [];
                    var listado_reporte2 = [];
                    var listado_reporte3 = [];
                    var listado_reporte4 = [];
                    var listado_sin_erp = [];

                    employees_res.forEach(element => {

                        var compras_empleado = compras_list.filter(a => a.employee[0].id == element.id);
                        var total_compra = compras_empleado.reduce((total, c) => total + c.total, 0);

                        var item_reporte = {
                            codigo_erp : element.code_erp,
                            nombre: element.name,
                            total_compra: parseFloat(total_compra).toFixed(2)
                        }

                        // listado_reporte.push(item_reporte);

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
                                to: element.email,
                                body: `Estimado ${element.name}, se te notifica que tu consumo en cafetería desde el ${dateInit.toDateString()} hasta el ${dateFinish.toDateString()} fue de: $${parseFloat(total_compra).toFixed(2)}, cualquier duda o consulta hacerla a jmelgar@red4g.net, EXT: 7877`,
                                subject: 'Compra',
                                from_name: 'red5g market',
                                to_name: `${element.name}`
                            }
                        };

                        console.log(`Estimado ${element.name}, se te notifica que tu consumo en cafetería desde el ${dateInit.toDateString()} hasta el ${dateFinish.toDateString()} fue de: $${parseFloat(total_compra).toFixed(2)}, cualquier duda o consulta hacerla a jmelgar@red4g.net, EXT: 7877`)
                        request(options, function (error, response, body) {
                            if (error) console.log(error)

                            console.log(body);
                        });

                        var red4g = [
                            'RED4G11',
                            'RED4G12',
                            'RED4G09',
                            'RED4G16',
                            'RED4G17',
                            'RED4G06',
                            'RED4G13',
                            'RED4G15',
                            'RED4G14',
                            'RED4G21',
                            'RED4G18',
                            'RED4G19',
                            'RED4G27',
                            'RED4G26',
                            'RED4G29',
                            'RED4G37',
                            'RED4G30',
                            'RED4G31',
                            'RED4G32',
                            'RED4G34',
                            'RED4G38',
                            'RED4G39',
                            'RED4G40',
                            'RED4G41',
                            'RED4G42',
                            'Red4G44',
                            'RED4G45',
                            'Red4G49',
                            'RED4G50',
                            'RED4G52',
                            'RED4G53',
                            'RED4GCOCINA01',
                            'RED4G54',
                            'RED4GCOCINA04',
                            'RED4GCOCINA05',
                            'RED4G55',
                            'RED4G61',
                            'RED4G62',
                            'RED4G63',
                            'RED4G84',
                            'RED4GCOCINA07',
                            'RED4G57',
                            'RED4GCOCINA08',
                            'RED4G58',
                            'RED4G64'
                        ]
                        var directv = ['DTV001',
                        'DTV191',
                        'DTV226',
                        'DTV225',
                        'QACENTRAL15',
                        'WIRELESS25',
                        'DISH32',
                        'DISH36',
                        'WIRELESS23',
                        'DISH29',
                        'DISH30',
                        'DISH22',
                        'QACENTRAL16',
                        'DISH27',
                        'DISH35',
                        'DISH31',
                        'DISH07',
                        'DISH33',
                        'DISH34',
                        'DISH26',
                        'DISH28',
                        'QACENTRAL17',
                        'DISH25',
                        'VIASAT17',
                        'DTV228',
                        'DISH23',
                        'DISH10',
                        'VIASAT09',
                        'VIASAT13',
                        'VIASAT14',
                        'VIASAT15',
                        'VIASAT10',
                        'DTV207',
                        'VIASAT16',
                        'VIASAT11',
                        'VIASAT12',
                        'DISH24',
                        'QACENTRAL13',
                        'QACENTRAL14',
                        'RED4G64',
                        'DTV192',
                        'DTV005',
                        'SUPWIRELESS03',
                        'QACENTRAL02',
                        'SUPDTV03',
                        'DTV05',
                        'SUPDTV06',
                        'SUPQUALITYC01',
                        'SUPDTV02',
                        'DTV25',
                        'DTV33',
                        'SUPDTV04',
                        'QACENTRAL09',
                        'SUPQUALITYL01',
                        'DTV38',
                        'DTV37',
                        'DTV40',
                        'DTV26',
                        'SUPDTVIN01',
                        'DTVIN01',
                        'SUPDTV09',
                        'DTV34',
                        'SUPWIRELESS01',
                        'SUPDTV07',
                        'DTV41',
                        'DTV35',
                        'DTV13',
                        'QACENTRAL05',
                        'SUP OPUS01',
                        'DTV69',
                        'DTV72',
                        'QUALITY75',
                        'QACENTRAL10',
                        'SUPWIRELESS02',
                        'DTV83',
                        'DTV86',
                        'DTV87',
                        'DTV92',
                        'DTV106',
                        'DTV96',
                        'DTV97',
                        'DTV98',
                        'SUPVIASAT01',
                        'QALOCAL02',
                        'WIRELESS07',
                        'DTV108',
                        'QACENTRAL08',
                        'DTV111',
                        'DTV113',
                        'WIRELESS02',
                        'DTV128',
                        'WIRELESS19',
                        'WIRELESS05',
                        'WIRELESS13',
                        'WIRELESS16',
                        'WIRELESS04',
                        'DTV139',
                        'DTV140',
                        'DTV141',
                        'QACENTRAL11',
                        'DTV143',
                        'DTV144',
                        'DTV147',
                        'DTV148',
                        'DTV149',
                        'DTV157',
                        'DTV158',
                        'DTV159',
                        'DTV160',
                        'WIRELESS20',
                        'DTV162',
                        'DTV165',
                        'QALOCAL01',
                        'DTV173',
                        'WIRELESS14',
                        'DTV180',
                        'QACENTRAL07',
                        'DTV185',
                        'DTV186',
                        'DTV193',
                        'VIASAT01',
                        'VIASAT07',
                        'VIASAT02',
                        'VIASAT05',
                        'DTV196',
                        'DTV198',
                        'VIASAT06',
                        'DTV201',
                        'VIASAT08',
                        'WIRELESS11',
                        'WIRELESS01',
                        'DTV205',
                        'DTV207',
                        'VIASAT03',
                        'VIASAT04',
                        'WIRELESS10',
                        'WIRELESS15',
                        'WIRELESS12',
                        'WIRELESS09',
                        'WIRELESS08',
                        'DTVIN03',
                        'DTV216',
                        'DTV219',
                        'DTV221',
                        'DTV223',
                        'WIRELESS21',
                        'DTVIN05',
                        'DTV235',
                        'DTV236',
                        'WIRELESS22',
                        'QALOCAL03']
                        var mediotiempo = ['RED4G35',
                        'RED4G60',]
                        var contactcenter = ['CostumerCC01',
                        'QACC02',
                        'DTVCC06',
                        'DTVCC17',
                        'DTVCC13',
                        'DTVCC15',
                        'SUP Red4gCC4',
                        'RecargasCC07',
                        'DTVCC24',
                        'SUP Red4gCC1',
                        'Mon4GCC01',
                        'DTVCC26',
                        'DTVCC20',
                        'DTVCC09',
                        'QACC03',
                        'DTVCC16',
                        'RecargasCC05',
                        'SUP Red4GCC7',
                        'CostumerCC02',
                        'DTVCC01',
                        'Mon4GCC003',
                        'Mon4GCC06',
                        'DTVCC03',
                        'SUP Red4gCC6',
                        'DTVCC22',
                        'DTVCC23',
                        'SUP Red4gCC5',
                        'DTVCC25',
                        'DTVCC05',
                        'QACC05',
                        'DTVCC19',
                        'DTVCC08',
                        'CostumerCC05',
                        'DTVCC02',
                        'CostumerCC04',
                        'SUP Red4gCC2',
                        'DTVCC12',
                        'DTVCC14',
                        'DTVCC21',
                        'DTVCC04',
                        'Mon4GCC05',
                        'RecargasCC01',
                        'GGRed4gCC1',
                        'CostumerCC03',
                        'Mon4GCC02',
                        'DTVCC07',
                        'SUP Red4gCC3',
                        'QACC04',
                        'RecargasCC02',
                        'Red4GCC01',
                        'RecargasCC04',
                        'QACC01',
                        'Mon4GCC04',
                        'RecargasCC03', ]

                        var compras_empleado = compras_list.filter(a => a.employee[0].id == element.id);
                        var total_compra = compras_empleado.reduce((total, c) => total + c.total, 0);

                        var item_reporte = {
                            codigo_erp : element.code_erp,
                            nombre: element.name,
                            total_compra: parseFloat(total_compra).toFixed(2)
                        }
                        if(item_reporte.codigo_erp) {

                            if(red4g.indexOf(item_reporte.codigo_erp.trim()) > -1) {
                                listado_reporte.push(item_reporte);
                            }

                            if(directv.indexOf(item_reporte.codigo_erp.trim()) > -1) {
                                listado_reporte2.push(item_reporte);
                            }

                            if(mediotiempo.indexOf(item_reporte.codigo_erp.trim()) > -1) {
                                listado_reporte3.push(item_reporte);
                            }

                            if(contactcenter.indexOf(item_reporte.codigo_erp.trim()) > -1) {
                                listado_reporte4.push(item_reporte);
                            }

                            if(
                                red4g.indexOf(item_reporte.codigo_erp.trim()) == -1 &&
                                directv.indexOf(item_reporte.codigo_erp.trim()) == -1 &&
                                mediotiempo.indexOf(item_reporte.codigo_erp.trim()) == -1 &&
                                contactcenter.indexOf(item_reporte.codigo_erp.trim()) == -1
                            ) {
                                listado_sin_erp.push(item_reporte)
                                console.log("item sin erp", item_reporte)
                            }

                        }



                    });

                    var planilla1 = json2xls(listado_reporte);
                    fs.writeFileSync('planilla1.xlsx', planilla1, 'binary');

                    var planilla2 = json2xls(listado_reporte2);
                    fs.writeFileSync('planilla2.xlsx', planilla2, 'binary');

                    var planilla3 = json2xls(listado_reporte3);
                    fs.writeFileSync('planilla3.xlsx', planilla3, 'binary');

                    var planilla4 = json2xls(listado_reporte4);
                    fs.writeFileSync('planilla4.xlsx', planilla4, 'binary');

                    var noerp = json2xls(listado_sin_erp);
                    fs.writeFileSync('noerp.xlsx', noerp, 'binary');

                    res.json({
                        message: "Reportes de planilla generados con exito",
                        noerp: noerp
                    })

                })
            }
        })
    }



    generateExcelCompra(req, res) {

        let dateInit = new Date(`${req.params.date_init} 00:00:00`) ;
        let dateFinish = new Date(`${req.params.date_finish} 23:59:59`);

        Compra.find({
            createdAt: {
                $gte: dateInit,
                $lte: dateFinish
            }
        }, {},{
            sort: { createdAt: -1}
        }).populate('employee').exec((err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                var compras_list = r.filter(a => a.employee !== null);

                Employee.find().exec((err, employees_res) => {

                    var listado_reporte = [];

                    employees_res.forEach(element => {
                        var compras_empleado = compras_list.filter(a => a.employee[0].id == element.id);
                        var total_compra = compras_empleado.reduce((total, c) => total + c.total, 0);

                        var item_reporte = {
                            codigo_erp : element.code_erp,
                            nombre: element.name,
                            total_compra: parseFloat(total_compra).toFixed(2)
                        }

                        listado_reporte.push(item_reporte);

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
                                to: element.email,
                                body: `estimado ${element.name}, se te notifica que tu consumo en cafeteria esta quincena fue de: $${parseFloat(total_compra).toFixed(2)}, cualquier duda o consulta hacerla a jmelgar@red4g.net`,
                                subject: 'Compra',
                                from_name: 'red5g market',
                                to_name: `${element.name}`
                            }
                        };

                        request(options, function (error, response, body) {
                            if (error) console.log(error)

                            console.log(body);
                        });

                    });

                    console.table(listado_reporte);

                    var xls = json2xls(listado_reporte);

                    fs.writeFileSync('data.xlsx', xls, 'binary');

                })
            }
        })
    }

    generateJsonReport(req, res) {

        let dateInit = new Date(`${req.params.date_init} 00:00:00`);
        let dateFinish = new Date(`${req.params.date_finish} 23:59:59`)

        Compra.find({
            createdAt: {
                $gte: dateInit,
                $lte: dateFinish
            }
        }, {},{
            sort: { createdAt: -1}
        }).populate('employee').exec((err, r) => {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                var compras_list = r.filter(a => a.employee !== null);


                Employee.find().exec((err, employees_res) => {

                    var listado_reporte = [];

                    employees_res.forEach(element => {
                        var compras_empleado = compras_list.filter(a => a.employee[0].id == element.id);
                        var total_compra = compras_empleado.reduce((total, c) => total + c.total, 0);

                        var item_reporte = {
                            ext: element.ext,
                            codigo_erp : element.code_erp,
                            nombre: element.name,
                            total_compra: parseFloat(total_compra).toFixed(2)
                        }

                        listado_reporte.push(item_reporte);


                    });

                    console.table(listado_reporte);

                    return res.json(listado_reporte)

                })
            }
        })
    }
}

module.exports = new ReportController;