const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class  Review extends Model {
  
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

   Review.init(
    {
     
    },

    {
      sequelize,
      modelName: "review",
      underscored: true,
    }
  );
  return  Review;
};

