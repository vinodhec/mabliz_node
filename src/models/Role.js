const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

  Role.init(
    {
      name: DataTypes.STRING,
      business_ids:{
        type: DataTypes.JSON,
        get: function () {
          console.log(this.getDataValue("business_ids"));
          return JSON.parse(this.getDataValue("business_ids") || "[]");
        },
        set: function (value) {
          // this.setDataValue('open_timing',value[0].time[0].start_time);
          // this.setDataValue('open_timing',value[0].time[value[0].time.length-1].end_time);

          this.setDataValue("business_ids", JSON.stringify(value || []));
        },

      }
   
    },

    {
      sequelize,
      modelName: "role",
      underscored: true,
    }
  );
  return Role;
};
