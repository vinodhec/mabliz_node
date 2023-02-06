const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class  Rolebranch extends Model {
  
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

   Rolebranch.init(
    {},

    {
      sequelize,
      modelName: "rolebranch",
      underscored: true,
    }
  );
  return  Rolebranch;
};

