const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class  roleusermodule extends Model {
  
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

   roleusermodule.init(
    {
      
    },

    {
      sequelize,
      modelName: "roleusermodule",
      underscored: true,
    }
  );
  return  roleusermodule;
};

