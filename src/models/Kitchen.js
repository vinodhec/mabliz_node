const { Model } = require("sequelize");
const { itemStatus } = require("./../config/constant");

module.exports = (sequelize, DataTypes) => {
  class  Kitchen extends Model {
  
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

   Kitchen.init(
    {
      name:DataTypes.STRING,
      status: {
        type: DataTypes.STRING,
        defaultValue: itemStatus.STATUS_ACTIVE
      }
    },

    {
      sequelize,
      modelName: "kitchen",
      underscored: true,
    }
  );
  return  Kitchen;
};

