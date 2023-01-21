const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class  Itemvariant extends Model {
  
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

   Itemvariant.init(
    {
     selling_size:DataTypes.STRING,
     selling_qty:DataTypes.FLOAT,name:DataTypes.STRING,
     name_local_language: DataTypes.STRING,
description:DataTypes.STRING,
dish_code:DataTypes.STRING,
search_code:DataTypes.STRING,
special_notes:DataTypes.TEXT,
photo:DataTypes.STRING,
selling_price:DataTypes.FLOAT,
dinning_price:DataTypes.FLOAT,
ac_dinning_price:DataTypes.FLOAT,
takeaway_price:DataTypes.FLOAT,
delivery_price:DataTypes.FLOAT,
dinning_discount:DataTypes.FLOAT,

selling_discount:DataTypes.FLOAT,
ac_dinning_discount:DataTypes.FLOAT,
takeaway_discount:DataTypes.FLOAT,
delivery_discount:DataTypes.FLOAT,

purchase_unit:DataTypes.STRING,
selling_unit:DataTypes.STRING,
purchase_method:DataTypes.STRING,
selling_method:DataTypes.STRING,
purchase_tax:DataTypes.FLOAT,
purchase_tax_method:DataTypes.STRING,
sales_tax:DataTypes.FLOAT,
sales_tax_method:DataTypes.STRING,
stock_type:DataTypes.STRING,
min_stock_notification:DataTypes.STRING,
mfg_date:DataTypes.DATEONLY,
exp_date:DataTypes.DATEONLY,
batch_no:DataTypes.STRING,
hsn_code:DataTypes.STRING,
qr_code:DataTypes.TEXT,
barcode:DataTypes.TEXT,
isPhoto:DataTypes.STRING
    },

    {
      sequelize,
      modelName: "itemvariant",
      underscored: true,
    }
  );
  return  Itemvariant;
};

