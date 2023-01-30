const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class  Roleuserbranch extends Model {
  
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

   Roleuserbranch.init(
    {
     
    },

    {
      sequelize,
      modelName: "roleuserbranch",
      underscored: true,
    }
  );
  return  Roleuserbranch;
};

