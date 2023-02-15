const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class  ItemCategory extends Model {
  
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

   ItemCategory.init(
    {
     name:DataTypes.STRING,
     business_id:DataTypes.INTEGER
     
    },

    {
      sequelize,
      modelName: "itemcategory",
      underscored: true,
    }
  );
  return  ItemCategory;
};

