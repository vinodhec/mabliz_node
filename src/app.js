const express = require("express");
const cors = require("cors");
const passport = require("passport");
const httpStatus = require("http-status");
const routes = require("./route");
const bodyParser = require("body-parser");
const path = require("path");
const { jwtStrategy } = require("./config/passport");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./helper/ApiError");
const models = require("./models/");
const utilHandler = require("./helper/utilHelper");

process.env.PWD = process.cwd();

const app = express();

// enable cors
app.use(cors());
app.options("*", cors());

app.use(express.static(`${process.env.PWD}/public`));
app.use(express.static(`${process.env.PWD}/registration`));
// app.use(express.static(
//   path.join(__dirname,"../client/build")));
app.use(bodyParser.json({ limit: "50mb" }));

app.use(bodyParser.urlencoded({ limit: "25mb", extended: true }));
const multer = require("multer");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "registration");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const imagesMiddleWare = (req, res, next) => {

  if (req.is("multipart/form-data")) {
    const images = {};
    req.files?.forEach((file) => {
      images[file.fieldname] = utilHandler.getAbsolutePath(file.filename);
    });
    req.body = { ...JSON.parse(req.body.details), ...images };
    req.headers["content-type"] = "application/json";

  }
  next();
};

app.use(multer({ storage: fileStorage }).any("images"));
app.use(imagesMiddleWare);
// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

app.get("/", async (req, res) => {
  res.status(200).send("Congratulations! API is working!");
});
app.use("/api", routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);
const db = require("./models");

const User = models.user;
const Business = models.business;
const Branch = models.branch;
const BusinessTypes = models.businesstype;
const BusinessCategory = models.businesscategory;
const BusinessActivity = models.businessactivity;
const Plan = models.plan;
const Role = models.role;
const Permission = models.permission;
const Rolepermission = models.rolepermission;
const Module = models.module;
const Businesstypemodule = models.businesstypemodule;
const PlanValidity = models.planvalidity;

const Planbranch = models.planbranch;
const Addon = models.addon;
const Rolemoduleuser = models.rolemoduleuser;
const Planbranchaddon = models.planbranchaddon;
const Employment = models.employment;
const Attendance = models.attendance;
const Approval = models.approval;

User.hasMany(Employment);
Employment.belongsTo(User);

User.hasMany(Approval);
Approval.belongsTo(User);

User.hasMany(Business,{ onDelete: 'cascade', hooks:true });
Business.belongsTo(User);

User.hasMany(User,{ onDelete: 'cascade', hooks:true });
User.belongsTo(User);

BusinessTypes.belongsTo(User);
User.hasMany(BusinessTypes);
Business.hasMany(Branch,{ onDelete: 'cascade', hooks:true });
Branch.belongsTo(Business);
BusinessCategory.belongsTo(BusinessTypes);
BusinessTypes.hasMany(BusinessCategory);

BusinessActivity.belongsTo(BusinessCategory);
BusinessCategory.hasMany(BusinessActivity);
Module.hasMany(Permission);
Plan.hasMany(PlanValidity);
PlanValidity.belongsTo(Plan);

BusinessTypes.hasMany(Plan);
Plan.belongsTo(BusinessTypes);

Branch.belongsToMany(Plan, { through: Planbranch });
Plan.belongsToMany(Branch, { through: Planbranch });

Planbranch.belongsToMany(Addon, { through: Planbranchaddon });
Addon.belongsToMany(Planbranch, { through: Planbranchaddon });
User.hasMany(Role,{ onDelete: 'cascade', hooks:true });
Role.belongsTo(User);

User.hasMany(User);
User.belongsTo(User)
User.hasMany(Attendance)
// User.hasOne(Role);
Role.belongsToMany(Permission, { through: Rolepermission});
Permission.belongsToMany(Role, { through: Rolepermission});
BusinessTypes.belongsToMany(Module,{through:Businesstypemodule});
// db.sequelize.sync({force:true});
Role.belongsToMany(Module,{through:Rolemoduleuser})
Module.belongsToMany(Role,{through:Rolemoduleuser})

// db.sequelize.sync({alter:true});

db.sequelize.sync();
module.exports = app;
