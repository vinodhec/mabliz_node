const { Model } = require("sequelize");
const { itemStatus } = require("./../config/constant");

module.exports = (sequelize, DataTypes) => {
  class  printer extends Model {
  
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

   printer.init(
    {
      sNo:DataTypes.INTEGER,
     name:DataTypes.STRING,
     location:DataTypes.INTEGER,
     location_type:DataTypes.STRING,
     type:DataTypes.STRING,
     ip_address :DataTypes.STRING,
     portnumber :DataTypes.INTEGER,
     bill:DataTypes.BOOLEAN,
     settlement:DataTypes.BOOLEAN,
     waiter:DataTypes.BOOLEAN,
     kot:DataTypes.BOOLEAN,
     token:DataTypes.BOOLEAN,
     status: {
      type: DataTypes.STRING,
      defaultValue: itemStatus.STATUS_ACTIVE
    }
    },

    {
      sequelize,
      modelName: "printer",
      underscored: true,
    }
  );
  return  printer;
};

