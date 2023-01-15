const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class  Attendance extends Model {
  
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

   Attendance.init(
    {
     ratings:DataTypes.INTEGER,
     is_present:DataTypes.BOOLEAN,
     marked_by:DataTypes.INTEGER
    },

    {
      sequelize,
      modelName: "attendance",
      underscored: true,
    }
  );
  return  Attendance;
};
