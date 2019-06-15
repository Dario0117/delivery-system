const router = require('express').Router();
const Sequelize = require('sequelize');
const { Delivery, Address, Driver } = require('../db');

router.route('/pedidos')
    .post(async (req, res) => {
        let body = {
            product: req.body.product,
            date: req.body.date,
            address: req.body.address,
            timeStart: req.body.timeStart,
            timeEnd: req.body.timeEnd,
        };
        if (body.timeEnd < 0 || body.timeEnd >  24) {
            res.status(400).json({
                msg: "La hora final debe estar entre la 1 y las 24h."
            });
        } else if (body.timeStart < 1 || body.timeStart >  23) {
            res.status(400).json({
                msg: "La hora inicial debe estar entre la 1 y las 23h."
            });
        } else if (body.timeStart > body.timeEnd) {
            res.status(400).json({
                msg: "La hora final debe sere mayor a la fecha inicial."
            });
        } else if (body.timeEnd - body.timeStart > 8 || body.timeEnd - body.timeStart < 1){
            res.status(400).json({
                msg: "La franja horaria debe estar entre 1 y 8h."
            });
        } else {
            try {
                let { address, id } = await Address.findOne({
                    where: {
                        ClientId: 1,
                        id: body.address,
                    },
                    attributes: ['address', 'id']
                });
                let driver = await Driver.findOne({
                    order: Sequelize.literal('rand()')
                });
                let delivery = await Delivery.create({
                    ...body,
                    ClientId: 1,
                    DriverId: driver.id,
                });
                res.status(201).json(delivery);
            } catch (error) {
                res.status(400).json({
                    msg: "La dirección suministrada no existe o no pertenece a este cliente."
                });
            }
        }
    });

module.exports = router;