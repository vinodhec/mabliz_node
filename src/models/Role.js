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
      business_type_label: DataTypes.STRING,
      business_type: {
        type: DataTypes.JSON,
        set: function (val) {
          this.setDataValue("business_type_label", val.label);

          return this.setDataValue("business_type_id", val.id);
        },
      },
      business_type_id: {
        type: DataTypes.INTEGER,
      },
      branch_ids:{
        type: DataTypes.JSON,
        get: function () {
          console.log(this.getDataValue("branch_ids"));
          return JSON.parse(this.getDataValue("branch_ids") || "{}");
        },
        set: function (value) {
          // this.setDataValue('open_timing',value[0].time[0].start_time);
          // this.setDataValue('open_timing',value[0].time[value[0].time.length-1].end_time);

          this.setDataValue("branch_ids", JSON.stringify(value || {}));
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
