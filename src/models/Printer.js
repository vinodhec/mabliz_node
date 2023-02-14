const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class  printer extends Model {
  
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

   printer.init(
    {
     name:DataTypes.STRING,
     title:DataTypes.STRING,
     ip_address :DataTypes.STRING,
     portnumber :DataTypes.INTEGER,
     service_type:DataTypes.STRING,
     
    
    },

    {
      sequelize,
      modelName: "printer",
      underscored: true,
    }
  );
  return  printer;
};

