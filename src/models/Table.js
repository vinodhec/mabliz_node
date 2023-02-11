const { Model } = require("sequelize");
const { itemStatus } = require("./../config/constant");

module.exports = (sequelize, DataTypes) => {
  class Table extends Model {

    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

  Table.init(
    {
      sNo: DataTypes.INTEGER,
      name: DataTypes.STRING,
      capacity: DataTypes.INTEGER,
      approval_action: DataTypes.STRING,
      approval_id: DataTypes.STRING,
      status: {
        type: DataTypes.STRING,
        defaultValue: itemStatus.STATUS_ACTIVE
      }
    },

    {
      sequelize,
      modelName: "table",
      underscored: true,
    }
  );
  return Table;
};

