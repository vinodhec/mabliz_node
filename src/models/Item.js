const { Model } = require("sequelize");
const { itemStatus } = require("./../config/constant");

module.exports = (sequelize, DataTypes) => {
    class Item extends Model {

        static associate(models) {
            // define association here
            //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
        }
    }

    Item.init(
        {
            cuisine: DataTypes.STRING,
            type: DataTypes.STRING,
            variety: DataTypes.STRING,
            category: DataTypes.STRING,
            sub_category: DataTypes.STRING,
            brand: DataTypes.STRING,
            item_generic_name: DataTypes.STRING,
            name_local_language: DataTypes.STRING,
            order_type: DataTypes.STRING,
            pre_booking: DataTypes.STRING,
            description: DataTypes.STRING,
            available_time: DataTypes.STRING,
            availability_days: DataTypes.STRING,
            kitchen_notes: DataTypes.TEXT,
            customize: DataTypes.TEXT,
            add_ons: DataTypes.TEXT,
            status:{
                type:DataTypes.STRING,
defaultValue:itemStatus.STATUS_ACTIVE
            }
        },

        {
            sequelize,
            modelName: "item",
            underscored: true,
        }
    );
    return Item;
};

