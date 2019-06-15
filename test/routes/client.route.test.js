const request = require('supertest');
const faker = require('faker');
const app = require('../../src/index');
const { connection, Driver } = require('../../src/db');

faker.locale = 'es_MX';

beforeAll((done) => {
    connection.sync().then(() => {
        Driver.bulkCreate(require('../../src/defaultData/Drivers.data'))
        done();
    });
});

describe('Client routes', () => {
    let goodUser;
    let userWuthoutEmail;
    let userWithoutAddresses;
    let userWithZeroAddresses;
    beforeAll(() => {
        goodUser = {
            name: faker.name.findName(),
            password: faker.internet.password(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            addresses: [
                faker.address.streetAddress(),
                faker.address.streetAddress(),
            ],
            token: '',
        };
        userWuthoutEmail = {
            name: faker.name.findName(),
            password: faker.internet.password(),
            phone: faker.phone.phoneNumber(),
            addresses: [
                faker.address.streetAddress(),
                faker.address.streetAddress(),
            ],
            token: '',
        };
        userWithoutAddresses = {
            name: faker.name.findName(),
            password: faker.internet.password(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            token: '',
        };
        userWithZeroAddresses = {
            name: faker.name.findName(),
            password: faker.internet.password(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            addresses: [],
            token: '',
        };
    });
    it('should register a user', (done) => {
        request(app)
            .post('/registro')
            .send(goodUser)
            .expect(201, done);
    })
    it('should not create a user with the same email', (done) => {
        request(app)
            .post('/registro')
            .send(goodUser)
            .expect(400, done);
    })
    it('should not create a user without email', (done) => {
        request(app)
            .post('/registro')
            .send(userWuthoutEmail)
            .expect(400, done);
    })
    it('should not create a user without address', async  (done) => {
        await request(app)
            .post('/registro')
            .send(userWithoutAddresses)
            .expect(400);

        await request(app)
            .post('/registro')
            .send(userWithZeroAddresses)
            .expect(400);

        done();
    })
    it('should login a user', (done) => {
        request(app)
            .post('/login')
            .send({
                email: goodUser.email,
                password: goodUser.password,
            })
            .expect(200)
            .then((res) => {
                let { body } = res;
                expect(body.token).toBeTruthy();
                goodUser.token = `Bearer ${body.token}`;
                done();
            });
    })
    it('should not login a user with wrong password', (done) => {
        request(app)
            .post('/login')
            .send({
                email: goodUser.email,
                password: 'BAD_PASSWORD',
            })
            .expect(400, done);
    })
    it('should not login a user with missing parameters', async (done) => {
        await request(app)
            .post('/login')
            .send({
            })
            .expect(400);

        await request(app)
            .post('/login')
            .send({
                email: goodUser.email,
            })
            .expect(400);
        
        await request(app)
            .post('/login')
            .send({
                password: goodUser.password,
            })
            .expect(400);
        done();
    })
})