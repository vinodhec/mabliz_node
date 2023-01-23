const { Model } = require("sequelize");
const { itemStatus } = require("./../config/constant");


const splitAndUpdate=(context,val1,val2,val,seperator=",")=>{
  if(!val) return;
  const sp = val.toString().split(seperator)
  context.setDataValue(val1,parseFloat(sp[0]));
  context.setDataValue(val2,sp[1] ? parseFloat(sp[1]):0);

}

const splitAndUpdateTax=(context,val1,val2,val,seperator=":")=>{
  if(!val) return;
  const sp = val.toString().split(seperator)
  context.setDataValue(val1,parseFloat(sp[0]));
  context.setDataValue(val2,sp[1] ? sp[1]:0);

}


module.exports = (sequelize, DataTypes) => {
  class Itemvariant extends Model {

    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

  Itemvariant.init(
    {
      selling_size: DataTypes.STRING,
      selling_qty: DataTypes.FLOAT, name: DataTypes.STRING,
      name_local_language: DataTypes.STRING,
      variant_description: DataTypes.STRING,
      dish_code: {type:DataTypes.INTEGER, isNull:false},
      search_code: DataTypes.STRING,
      special_notes: DataTypes.TEXT,
      photo: DataTypes.STRING,
      selling_price: DataTypes.FLOAT,
      dinning_service_charge:DataTypes.FLOAT,
      dinning_price:DataTypes.FLOAT,
      status:{
        type:DataTypes.STRING,
defaultValue:itemStatus.STATUS_ACTIVE
    },
      self_service_price_virtual: {type:DataTypes.VIRTUAL,

        set:function(val){
     
          splitAndUpdate(this,"self_service_price","self_service_service_charge",val)
        }

      },

      open_dinning_price_virtual: {type:DataTypes.VIRTUAL,

        set:function(val){
     
          splitAndUpdate(this,"open_dinning_price","open_dinning_service_charge",val)
        }

      },

      ac_dinning_price_virtual: {type:DataTypes.VIRTUAL,

        set:function(val){
     
          splitAndUpdate(this,"ac_dinning_price","ac_dinning_service_charge",val)
        }

      },

      dinning_price_virtual: {type:DataTypes.VIRTUAL,

        set:function(val){
     
          splitAndUpdate(this,"dinning_price","dinning_service_charge",val)
        }

      },
      takeaway_price_virtual: {type:DataTypes.VIRTUAL,

        set:function(val){
     
          splitAndUpdate(this,"takeaway_price","takeaway_parcel_charge",val)
        }

      },
      delivery_price_virtual: {type:DataTypes.VIRTUAL,

        set:function(val){
     
          splitAndUpdate(this,"delivery_price","delivery_parcel_charge",val)
        }

      },
      self_service_service_charge:DataTypes.FLOAT,
      self_service_price: DataTypes.FLOAT,
      open_dinning_service_charge:DataTypes.FLOAT,
      open_dinning_price: DataTypes.FLOAT,

      ac_dinning_service_charge:DataTypes.FLOAT,
      ac_dinning_price: DataTypes.FLOAT,
      takeaway_price: DataTypes.FLOAT,
      takeaway_parcel_charge: DataTypes.FLOAT,

      delivery_price: DataTypes.FLOAT,
      delivery_parcel_charge: DataTypes.FLOAT,

      dinning_discount: DataTypes.FLOAT,

      selling_discount: DataTypes.FLOAT,
      ac_dinning_discount: DataTypes.FLOAT,
      takeaway_discount: DataTypes.FLOAT,
      self_service_discount: DataTypes.FLOAT,
      open_dining_discount: DataTypes.FLOAT,
      delivery_discount: DataTypes.FLOAT,
      price_1:DataTypes.FLOAT,
      price_2:DataTypes.FLOAT,
      price_3:DataTypes.FLOAT,
      price_4:DataTypes.FLOAT,
      purchase_unit: DataTypes.STRING,
  
      selling_unit: DataTypes.STRING,
      purchase_method: DataTypes.STRING,
      selling_method: DataTypes.STRING,
      purchase_tax: DataTypes.FLOAT,
      purchase_tax_method: DataTypes.STRING,
      purchase_tax_virtual:{
        type:DataTypes.VIRTUAL,
        set:function(val){
     
          splitAndUpdateTax(this,"purchase_tax","purchase_tax_method",val)
        }
      },
      sales_tax: DataTypes.FLOAT,
      sales_tax_method: DataTypes.STRING,
      sales_tax_virtual:{
        type:DataTypes.VIRTUAL,
        set:function(val){
     
          splitAndUpdateTax(this,"sales_tax","sales_tax_method",val)
        }
      },
      stock_type: DataTypes.STRING,
      min_stock_notification: DataTypes.STRING,
      mfg_date: DataTypes.STRING,
      exp_date: DataTypes.STRING,
      batch_no: DataTypes.STRING,
      hsn_code: DataTypes.STRING,
      qr_code: DataTypes.TEXT,

      barcode: DataTypes.TEXT,
      isPhoto: DataTypes.STRING,
      branch_id:DataTypes.INTEGER
    },

    {
      sequelize,
      modelName: "itemvariant",
      underscored: true,
    }
  );
  return Itemvariant;
};

