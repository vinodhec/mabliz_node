const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class  Roleuser extends Model {
  
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

   Roleuser.init(
    {
   role_id:DataTypes.INTEGER
    },

    {
      sequelize,
      modelName: "roleuser",
      underscored: true,
    }
  );
  return  Roleuser;
};

