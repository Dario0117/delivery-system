const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Model = Sequelize.Model;
    class Address extends Model {}
    Address.init({
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
    }, {
      sequelize,
    });

    return Address;
}
