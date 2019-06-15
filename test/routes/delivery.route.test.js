const request = require('supertest');
const faker = require('faker');
const Sequelize = require('sequelize');
const app = require('../../src/index');
const { connection, Driver, Delivery, Address } = require('../../src/db');

faker.locale = 'es_MX';

const Op = Sequelize.Op;

describe('Delivery routes', () => {
    let currentUser;
    beforeAll(async (done) => {
        currentUser = {
            name: faker.name.findName(),
            password: faker.internet.password(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            addresses: [
                faker.address.streetAddress(),
                faker.address.streetAddress(),
            ],
            token: '',
            id: 0,
        };

        let reg = await request(app)
            .post('/registro')
            .send(currentUser)
        currentUser.id = reg.body.id;
        let { body } = await request(app)
            .post('/login')
            .send({
                email: currentUser.email,
                password: currentUser.password,
            })
        currentUser.token = `Bearer ${body.token}`;
        let { id } = await Address.findOne({
            where: {
                ClientId: currentUser.id,
            },
            attributes: ['address', 'id']
        });
        currentUser.addressId = id;
        done();
    });

    // afterEach(async (done) => {
    //     await Delivery.destroy({
    //         where: {}
    //       });
    //     done();
    // });
    
    it('should create a delivery', (done) => {
        request(app)
            .post('/pedidos')
            .set('Authorization', currentUser.token)
            .send({
                product: faker.commerce.productName(),
                date: faker.date.future(),
                address: currentUser.addressId,
                timeStart: 1,
                timeEnd: 8
            })
            .expect(201, done);
    })
    it('should not create a delivery with wrong paramters', async (done) => {
        let wrongParameters = [
            { 
                product: faker.commerce.productName(),
                date: faker.date.future(),
                address: 5,
                timeStart: 1,
                timeEnd: 8
            },{ 
                product: faker.commerce.productName(),
                date: faker.date.future(),
                address: 1,
                timeStart: 0,
                timeEnd: 2
            },{ 
                product: faker.commerce.productName(),
                date: faker.date.future(),
                address: 1,
                timeStart: 1,
                timeEnd: 24
            },{ 
                product: faker.commerce.productName(),
                date: faker.date.future(),
                address: 1,
                timeStart: 5,
                timeEnd: 2
            },{ 
                product: faker.commerce.productName(),
                date: faker.date.future(),
                address: 1,
                timeStart: 1,
                timeEnd: 10
            },{ 
                product: faker.commerce.productName(),
                date: faker.date.future(),
                address: 1,
                timeStart: 1,
                timeEnd: 1
            }
        ]
        
        for(let body of wrongParameters) {
            await request(app)
                .post('/pedidos')
                .set('Authorization', currentUser.token)
                .send(body)
                .expect(400);
        }
        done();
    })
    it('should list all the deliveries to a specific driver', async (done) => {
        let date = faker.date.future();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        let totalDeliveries = 5;
        await Driver.destroy({
            where: {
                id: {
                    [Op.gt]: 1
                }
            }
        });
        for (let i = 0; i < totalDeliveries; i++) {
            await request(app)
                .post('/pedidos')
                .set('Authorization', currentUser.token)
                .send({
                    product: faker.commerce.productName(),
                    date,
                    address: currentUser.addressId,
                    timeStart: 1,
                    timeEnd: 8
                })
                .expect(201);
        }
        let res = await request(app)
                .get(`/pedidos/1`)
                .set('Authorization', currentUser.token)
                .query({
                    date
                })
                .expect(200);
        let body = res.body;
        expect(body.length).toBe(totalDeliveries);
        for (let delivery of body) {
            let rec = new Date(delivery.date);
            let act = new Date(date);
            expect(rec.toString()).toBe(act.toString());
        }
        done();
    })
})