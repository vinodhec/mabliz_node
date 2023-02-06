const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class  Rolepermission extends Model {
  
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

   Rolepermission.init(
    {
     need_approval:{type:DataTypes.BOOLEAN,defaultValue:false},
     module:{type:DataTypes.STRING},
     permission_name:{type:DataTypes.STRING}

    },

    {
      sequelize,
      modelName: "rolepermission",
      underscored: true,
    }
  );
  return  Rolepermission;
};

