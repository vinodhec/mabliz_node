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
      is_approval_authority:DataTypes.BOOLEAN,
      business_type_id: {
        type: DataTypes.INTEGER,
      },
      branch_ids:{
        type: DataTypes.TEXT,
        get: function () {
          console.log(typeof JSON.parse(this.getDataValue("branch_ids")));
          return JSON.parse(this.getDataValue("branch_ids") || "[]");
        },
        set: function (value) {
      
console.log(value,typeof value)
          this.setDataValue("branch_ids", JSON.stringify(value || []));
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
