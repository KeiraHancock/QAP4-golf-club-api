const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Member = sequelize.define(
    'Member',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        // Member Name
        type: DataTypes.STRING,
        allowNull: false
      },
      address: {
        // Member Address
        type: DataTypes.STRING
      },
      email: {
        // Member Email Address
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      phone: {
        // Member Phone Number
        type: DataTypes.STRING
      },
      membershipType: {
        // e.g. "Gold", "Silver", "Student"
        type: DataTypes.STRING
      },
      membershipStartDate: {
        // Start Date of membership
        type: DataTypes.DATEONLY
      },
      membershipDurationMonths: {
        // Duration of membership (months)
        type: DataTypes.INTEGER
      }
    },
    {
      timestamps: false
    }
  );

  return Member;
};
