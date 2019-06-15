module.exports = (sequelize) => {
    const Driver = require('./Driver')(sequelize);
    const Address = require('./Address')(sequelize);
    const Client = require('./Client')(sequelize);
    const Delivery = require('./Delivery')(sequelize);
    
    Address.belongsTo(Client);
    Client.hasMany(Address);

    Delivery.belongsTo(Address);
    Delivery.belongsTo(Driver);
    Delivery.belongsTo(Client);
    Driver.hasMany(Delivery);
    Client.hasMany(Delivery);
    Address.hasMany(Delivery);

    return {
        Driver,
        Address,
        Client,
        Delivery,
    }
}