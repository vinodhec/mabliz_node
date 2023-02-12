const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

  Permission.init(
    {
      name: {
        type: DataTypes.STRING,
        unique: 'name',
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING
      }
    },

    {
      sequelize,
      modelName: "permission",
      underscored: true,
    }
  );
  return Permission;
};
