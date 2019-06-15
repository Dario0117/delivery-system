const router = require('express').Router();
const Sequelize = require('sequelize');
const passport = require('passport');
const { Delivery, Address, Driver, Client } = require('../db');

function parseDelivery(delivery) {
    delivery.ClientName = delivery['Client.name'];
    delivery.ClientEmail = delivery['Client.email'];
    delivery.ClientPhone = delivery['Client.phone'];
    delivery.ClientAddress = delivery['Address.address'];
    delete delivery['Client.name'];
    delete delivery['Client.email'];
    delete delivery['Client.phone'];
    delete delivery['Address.address'];
    return delivery;
}

router.route('/pedidos')
    .all(passport.authenticate('jwt', { session: false }))
    .post(async (req, res) => {
        let body = {
            product: req.body.product || "NOT_SPECIFIED",
            date: new Date(req.body.date || new Date()),
            address: req.body.address || 0,
            timeStart: req.body.timeStart || 0,
            timeEnd: req.body.timeEnd || 25,
        };
        body.date.setMinutes(0);
        body.date.setSeconds(0);
        body.date.setMilliseconds(0);
        if (body.timeEnd < 0 || body.timeEnd > 24) {
            res.status(400).json({
                msg: "La hora final debe estar entre la 1 y las 24h."
            });
        } else if (body.timeStart < 1 || body.timeStart > 23) {
            res.status(400).json({
                msg: "La hora inicial debe estar entre la 1 y las 23h."
            });
        } else if (body.timeStart > body.timeEnd) {
            res.status(400).json({
                msg: "La hora final debe sere mayor a la fecha inicial."
            });
        } else if ((body.timeEnd - body.timeStart) > 8 || (body.timeEnd - body.timeStart) < 1){
            res.status(400).json({
                msg: "La franja horaria debe estar entre 1 y 8h."
            });
        } else {
            try {
                let activeUser = req.user;
                let { id } = await Address.findOne({
                    where: {
                        ClientId: activeUser.id,
                        id: body.address,
                    },
                    attributes: ['address', 'id']
                });
                let driver = await Driver.findOne({
                    order: Sequelize.literal('rand()')
                });
                let delivery = await Delivery.create({
                    ...body,
                    ClientId: activeUser.id,
                    DriverId: driver.id,
                    AddressId: id,
                });
                let deliveryRaw = await Delivery.findOne({
                    where: {
                        id: delivery.id
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
                        exclude: [ 'ClientId', 'AddressId']
                    },
                    raw: true
                })
                res.status(201).json(parseDelivery(deliveryRaw));
            } catch (error) {
                res.status(400).json({
                    msg: "La dirección suministrada no existe o no pertenece a este cliente; o no existen Drivers."
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

        res.status(200).json(deliveries.map(parseDelivery));
    });

module.exports = router;