const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './golfclub.sqlite',
  logging: false
});

module.exports = sequelize;
