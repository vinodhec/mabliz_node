const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class  Rolepermission extends Model {
  
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

   Rolepermission.init(
    {
     
    },

    {
      sequelize,
      modelName: "rolepermission",
      underscored: true,
    }
  );
  return  Rolepermission;
};

