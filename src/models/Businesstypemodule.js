const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class  Businesstypemodule extends Model {
  
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

   Businesstypemodule.init(
    {
     
    },

    {
      sequelize,
      modelName: "businesstypemodule",
      underscored: true,
    }
  );
  return  Businesstypemodule;
};

