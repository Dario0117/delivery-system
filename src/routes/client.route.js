const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Client, Address } = require('../db');

require('dotenv').config();

router.route('/registro')
    .post((req, res) => {
        let body = {...req.body};
        if (!body.email) {
            return res.status(400).json({
                msg: "El email debe ser diligenciado."
            });
        }
        if (!body.addresses || body.addresses && body.addresses.length === 0) {
            return res.status(400).json({
                msg: "Debe poner por lo menos una dirección."
            })
        }
        let salt = bcrypt.genSaltSync(10);
        body.password = bcrypt.hashSync(body.password, salt);
        let clientData = {}; 
        Client.create(body)
            .then((data) => {
                clientData = data;
                let addresses = body.addresses.map((address) => {
                    return {
                        ClientId: data.id,
                        address: address,
                    }
                });
                return Address.bulkCreate(addresses);
            }).then(() => {
                res.status(201).json({
                    name: clientData.name,
                    email: clientData.email,
                    phone: clientData.phone,
                });
            }).catch(() => {
                res.status(400).json({
                    msg: "Email en uso.",
                });
            });
    });

router.route('/login')
    .post((req, res) => {
        let { email, password } = req.body;
        Client.findOne({
            where: {
                email,
            }
        }).then((data) => {
            if (bcrypt.compareSync(password, data.password)) {
                res.status(200).json({
                    token: jwt.sign({ id: data.id }, process.env.JWT_SECRET),
                });
            } else {
                res.status(400).json({
                    msg: "Datos de inicio de sesión incorrectos."
                });
            }
        }).catch(() => {
            res.status(400).json({
                msg: "Datos de inicio de sesión incorrectos."
            });
        });
    });

module.exports = router;