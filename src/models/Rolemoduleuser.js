const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class  Rolemoduleuser extends Model {
  
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

   Rolemoduleuser.init(
    {
     user_id:DataTypes.INTEGER
    },

    {
      sequelize,
      modelName: "rolemoduleuser",
      underscored: true,
    }
  );
  return  Rolemoduleuser;
};

