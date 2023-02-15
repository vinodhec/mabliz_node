const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class  Kitchenbranchcategory extends Model {
  
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

   Kitchenbranchcategory.init(
    {
     branch_id:DataTypes.INTEGER,
     name:DataTypes.STRING
    },

    {
      sequelize,
      modelName: "kitchenbranchcategory",
      underscored: true,
    }
  );
  return  Kitchenbranchcategory;
};

