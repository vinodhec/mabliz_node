const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class  Employment extends Model {
  
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

   Employment.init(
    {
     branch_id:DataTypes.INTEGER,
     business_id:DataTypes.INTEGER,
     joining_date:DataTypes.DATEONLY,
     reliving_date:DataTypes.DATEONLY,
     owner_id:DataTypes.INTEGER,
     joined_by:DataTypes.INTEGER,
     relived_by:DataTypes.INTEGER
    },

    {
      sequelize,
      modelName: "employment",
      underscored: true,
    }
  );
  return  Employment;
};

