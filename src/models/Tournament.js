const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Tournament = sequelize.define(
    'Tournament',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      startDate: {
        // Start date
        type: DataTypes.DATEONLY
      },
      endDate: {
        // End date
        type: DataTypes.DATEONLY
      },
      location: {
        // Location
        type: DataTypes.STRING
      },
      entryFee: {
        // Entry Fee
        type: DataTypes.DECIMAL(10, 2)
      },
      cashPrize: {
        // Cash Prize Amount
        type: DataTypes.DECIMAL(10, 2)
      }
    },
    {
      timestamps: false
    }
  );

  return Tournament;
};
