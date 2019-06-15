const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Model = Sequelize.Model;
    class Client extends Model {}
    Client.init({
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      passwords: {
        type: Sequelize.STRING,
        allowNull: false
      },
    }, {
      sequelize,
    });

    return Client;
}
