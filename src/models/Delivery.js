const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Model = Sequelize.Model;
    class Delivery extends Model {}
    Delivery.init({
      product: {
        type: Sequelize.STRING,
        allowNull: false
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      timeStart: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      timeEnd: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
    }, {
      sequelize,
    });

    return Delivery;
}
