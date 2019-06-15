require('dotenv').config();
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Client, Address } = require('../db');

router.route('/registro')
    .post((req, res) => {
        if (!req.body.email) {
            return res.status(400).json({
                msg: "El email debe ser diligenciado."
            });
        }
        if (!req.body.addresses || req.body.addresses && req.body.addresses.length === 0) {
            return res.status(400).json({
                msg: "Debe poner por lo menos una dirección."
            })
        }
        let body = {...req.body};
        let salt = bcrypt.genSaltSync(10);
        let pw = bcrypt.hashSync(body.password, salt);
        body.password = pw;
        let clientData = {}; 
        Client.create(body)
            .then((data) => {
                clientData = data;
                let addresses = req.body.addresses.map((el) => {
                    return {
                        ClientId: data.id,
                        address: el,
                    }
                })
                return Address.bulkCreate(addresses);
            })
            .then(() => {
                res.status(201).json({
                    name: clientData.name,
                    email: clientData.email,
                    phone: clientData.phone,
                });
            })
            .catch((err) => {
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