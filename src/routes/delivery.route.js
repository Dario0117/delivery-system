const router = require('express').Router();
const Sequelize = require('sequelize');
const passport = require('passport');
const { Delivery, Address, Driver, Client } = require('../db');

router.route('/pedidos')
    .all(passport.authenticate('jwt', { session: false }))
    .post(async (req, res) => {
        let body = {
            product: req.body.product || "NON_SPECIFIED",
            date: new Date(req.body.date || new Date()),
            address: req.body.address || 0,
            timeStart: req.body.timeStart || 0,
            timeEnd: req.body.timeEnd || 25,
        };
        body.date.setMinutes(0);
        body.date.setSeconds(0);
        body.date.setMilliseconds(0);
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
                let loggedUser = req.user;
                let { id } = await Address.findOne({
                    where: {
                        ClientId: loggedUser.id,
                        id: body.address,
                    },
                    attributes: ['address', 'id']
                });
                let driver = await Driver.findOne({
                    order: Sequelize.literal('rand()')
                });
                let delivery = await Delivery.create({
                    ...body,
                    ClientId: loggedUser.id,
                    DriverId: driver.id,
                    AddressId: id,
                });
                res.status(201).json(delivery);
            } catch (error) {
                res.status(400).json({
                    msg: "La dirección suministrada no existe o no pertenece a este cliente."
                });
            }
        }
    });

router.route('/pedidos/:DriverId')
    .get(async (req, res) => {
        let { DriverId } = req.params;
        let date = new Date(req.query.date || new Date());
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);

        let deliveries = await Delivery.findAll({
            where: {
                date,
                DriverId,
            },
            include: [
                {
                    model: Client,
                    attributes: ['email', 'name', 'phone']
                },{
                    model: Address,
                    attributes: ['address']
                }
            ],
            attributes: {
                exclude: ['DriverId', 'ClientId', 'AddressId']
            },
            raw: true
        })

        res.status(200).json(deliveries.map((el) => {
            el.ClientName = el['Client.name'];
            el.ClientEmail = el['Client.email'];
            el.ClientPhone = el['Client.phone'];
            el.ClientAddress = el['Address.address'];
            delete el['Client.name'];
            delete el['Client.email'];
            delete el['Client.phone'];
            delete el['Address.address'];
            return el;
        }));
    });

module.exports = router;