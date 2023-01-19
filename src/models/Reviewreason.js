const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class  Reviewreason extends Model {
  
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

   Reviewreason.init(
    {
     label:DataTypes.STRING,
     business_type:DataTypes.INTEGER
    },

    {
      sequelize,
      modelName: "reviewreason",
      underscored: true,
    }
  );
  return  Reviewreason;
};

