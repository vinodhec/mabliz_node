const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class  Floor extends Model {
  
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

   Floor.init(
    {
        sNo:DataTypes.INTEGER,
    name:DataTypes.STRING
    },

    {
      sequelize,
      modelName: "floor",
      underscored: true,
    }
  );
  return  Floor;
};

