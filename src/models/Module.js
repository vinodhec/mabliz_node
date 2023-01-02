const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Module extends Model {
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

  Module.init(
    {
      name: DataTypes.STRING,
      permission_suffix:DataTypes.STRING,
      category:DataTypes.STRING,
      has_addon:{type:DataTypes.BOOLEAN,defaultValue:false}

    },

    {
      sequelize,
      modelName: "module",
      underscored: true,
    }
  );
  return Module;
};
