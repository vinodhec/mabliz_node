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
      is_approval_authority:DataTypes.STRING,
      business_type_id: {
        type: DataTypes.INTEGER,
      },
      owner_id:DataTypes.INTEGER,
    
   
    },

    {
      sequelize,
      modelName: "role",
      underscored: true,
    }
  );
  return Role;
};
