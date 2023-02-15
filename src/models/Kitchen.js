const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class  Kitchen extends Model {
  
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

   Kitchen.init(
    {
      name:DataTypes.STRING
    },

    {
      sequelize,
      modelName: "kitchen",
      underscored: true,
    }
  );
  return  Kitchen;
};

