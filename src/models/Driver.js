const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Model = Sequelize.Model;
    class Driver extends Model {}
    Driver.init({
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
    }, {
      sequelize,
    });

    return Driver;
}
