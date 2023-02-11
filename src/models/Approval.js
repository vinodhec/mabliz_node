const { Model } = require("sequelize");
const { differenceInMinutes } = require("date-fns");

module.exports = (sequelize, DataTypes) => {
    class Approval extends Model {

        static associate(models) {
            // define association here
            //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
        }
    }

    Approval.init(
        {
            approver_id: DataTypes.INTEGER,
            reason_id:DataTypes.INTEGER,
            class:DataTypes.STRING,
            method:DataTypes.STRING,
            second_level_approver:DataTypes.INTEGER,
            reason:DataTypes.TEXT,
            waiting_time: {
                type: DataTypes.VIRTUAL,
                get() {
                  console.log(this.getDataValue("createdAt"));
                  return differenceInMinutes(
                    new Date(),
                    this.getDataValue("createdAt")
                  );
                },
              },
            module:DataTypes.STRING,
            permission_name:DataTypes.STRING,
            action:DataTypes.STRING,

            models: {
                type: DataTypes.TEXT,
                get: function () {
                    console.log('parse')
                    return JSON.parse(this.getDataValue("models") || "[]");
                },
                set: function (value) {
                    // this.setDataValue('open_timing',value[0].time[0].start_time);
                    // this.setDataValue('open_timing',value[0].time[value[0].time.length-1].end_time);

                    this.setDataValue("models", JSON.stringify(value || []));
                },
            },
            status: DataTypes.INTEGER,
            action_time: DataTypes.DATE
        },

        {
            sequelize,
            modelName: "approval",
            underscored: true,
        }
    );

    Approval.addHook("afterUpdate", async (model, options) => {
        const data = model?.dataValues
        console.log({ data })

    });
    return Approval;
};

