const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class  planaccess extends Model {
  
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

   planaccess.init(
    {
     
    },

    {
      sequelize,
      modelName: "planaccess",
      underscored: true,
    }
  );
  return  planaccess;
};

