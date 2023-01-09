const { Model } = require("sequelize");
const { userConstant } = require("./../config/constant");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

  User.init(
    {
      uuid: DataTypes.UUID,
      name: DataTypes.STRING,
      lastName: DataTypes.STRING,
      middleName: DataTypes.STRING,
      dob: DataTypes.STRING,
      idProofType: DataTypes.STRING,
      idProofNumber: DataTypes.STRING,
      idProofImage: DataTypes.STRING,
      salary:DataTypes.FLOAT,
      salary_frequency:DataTypes.STRING,
      addressProofType: DataTypes.STRING,
      addressProofNumber: DataTypes.STRING,
      addressProofImage: DataTypes.STRING,
      photo: DataTypes.STRING,
      email: DataTypes.STRING,
      mpin: DataTypes.STRING,
      pfNo:DataTypes.STRING,
ESI:DataTypes.STRING,

      user_status: {
        type: DataTypes.INTEGER,
        defaultValue: userConstant.STATUS_INACTIVE,
      },


      branches: {
        type: DataTypes.JSON,

        set: function (val) {
         

          return  this.setDataValue("branch_ids", JSON.stringify(val.label.map((vv)=>vv.id) || []));
        },

      },
      reporting: {
        type: DataTypes.JSON,

        set: function (val) {
          this.setDataValue("reporting_user_name", val.name);

          return this.setDataValue("reporting_user_id", val.id);
        },
      },
      role_id:DataTypes.INTEGER,
      role: {
        type: DataTypes.JSON,

        set: function (val) {
          this.setDataValue("role_name", val.name);

          return this.setDataValue("role_id", val.id);
        },
      },
      role_name: {
        type: DataTypes.STRING,
      },
      reporting_user_id: {
        type: DataTypes.INTEGER,
      },
      reporting_user_name: {
        type: DataTypes.STRING,
      },
      phone_number: {
        type:DataTypes.STRING},
      isAdmin: {
        defaultValue: false,
        type: DataTypes.BOOLEAN
      },
      mode: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
          return this.getDataValue("mode")?.split(";");
        },
        set(val) {
          this.setDataValue("mode", val.join(";"));
        },
      },

      referal_code: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "user",
      underscored: true,
    }
  );
  return User;
};
