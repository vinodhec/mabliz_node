const httpStatus = require("http-status");
const AuthService = require("../service/AuthService");
const TokenService = require("../service/TokenService");
const BranchService = require("../service/BranchService");
const PermissionService = require("../service/PermissionService");

const { Op } = require("sequelize");
const { createNewOTP } = require("../helper/otpHelper");

const UserService = require("../service/UserService");
const logger = require("../config/logger");
const { branchStatus } = require("../config/constant");
const pluralize = require("pluralize");
const sequelize = require("sequelize");
const {
  crudOperations,
  crudOperationsTwoTargets,
} = require("../helper/utilHelper");

const responseHandler = require("../helper/responseHandler");
const { omit } = require("lodash");
class ProfileController {
  constructor() {
    this.userService = new UserService();

    this.tokenService = new TokenService();
    this.branchService = new BranchService();
    this.authService = new AuthService();
    this.permissionService = new PermissionService();

  }

  getBusinessTypes = async (req, res) => {

    const businessTypes = await req.user.getBusinesses({ attributes: ['business_type_label', 'business_type_id'] })

    res.json(responseHandler.returnSuccess(httpStatus.OK, "Success", businessTypes));

  }

  getUser = async (req, res) => {

    const { id, phone_number, id_proof_type, id_proof_no } = req.body;
    let user;
    if (id) {
      user = await this.userService.userDao.findById(id);
    }
    else if (phone_number) {
      user = await this.userService.userDao.findByPhoneNumber(phone_number);
    }
    else if (id_proof_type) {
      user = await this.userService.userDao.findOneByWhere({ [id_proof_type]: id_proof_no });

    }
    if (user) {
      const hash = await createNewOTP(phone_number);
      res.json(responseHandler.returnSuccess(httpStatus.OK, "OTP sent successfully", { phone_number: user.phone_number.slice(0, 2) + user.phone_number.slice(2).replace(/.(?=...)/g, '*'), hash }))

    }
    else {
      res.json(responseHandler.returnSuccess(httpStatus.OK, "User not found"))

    }



  }

  getRoles = async (req, res) => {
    const { user, query } = req;
    const { business_type_id } = query;
    let option = {
      include: this.permissionService.permissionDao.Model,
    }
    if (business_type_id) {
      option['where'] = { business_type_id }
    }
    const roles = await user.getRoles(option);

    res.json(responseHandler.returnSuccess(httpStatus.OK, "Success", roles));
  };

  addNewRoles = async (req, res) => {
    const { user, body } = req;
    const { permissions } = body;
    const role = await user.createRole(body);
    console.log({ role });

    const promise = await permissions.map(async ({ permission_suffix, need_approval }) => {
      const permission = await this.permissionService.permissionDao.findByWhere({ name: permission_suffix });
      await role.addPermissions(permission, { through: { need_approval } });
    })
    await Promise.all(promise)

    res.json(responseHandler.returnSuccess(httpStatus.OK, "Success", role));
  };

  updateRole = async (req, res) => {
    const { user, body } = req;
    const { id, permissions } = body;
    const role = await user.getRoles({ where: { id } });
    await role?.[0].update(body);
    console.log({ role });

    const promise = await permissions.map(async ({ permission_suffix, need_approval }) => {
      const permission = await this.permissionService.permissionDao.findById(permission_suffix);
      await role?.[0].addPermissions(permission, { through: { need_approval } });
    })
    await Promise.all(promise)

    res.json(responseHandler.returnSuccess(httpStatus.OK, "Success", role));
  };

  deleteRole = async (req, res) => {
    const { user, body } = req;
    const { id } = body;
    const role = await user.getRoles({ where: { id } });
    await role?.[0].destroy();
    // console.log({ role });

    // const promise = await permissions.map(async({id,need_approval})=>{
    //   const permission = await this.permissionService.permissionDao.findById(id);
    //   await role?.[0].addPermissions(permission,{ through: { need_approval } });
    // })
    // await Promise.all(promise)

    res.json(responseHandler.returnSuccess(httpStatus.OK, "Success", role));
  };

  getAddressRecord = async (req, res) => {
    const { id } = req.body;
    if (!id) {
      res.send(
        responseHandler.returnError(httpStatus.BAD_REQUEST, "Id is mandatory")
      );
      return;
    }

    const record = await req.user.getAddresses({
      where: {
        id,
      },
    });

    if (record.length === 0) {
      res.send(
        responseHandler.returnError(
          httpStatus.BAD_REQUEST,
          "Id: " + id + " Not found"
        )
      );
      return;
    }

    return record;
  };

  updateDetailsForActivation = async (req, res) => {
    const user = req.user;
    const userDetails = user.isAdmin
      ? await this.userService.userDao.findById(req.body.userId)
      : user;
    try {
      let result = omit(req.body, [
        "id",
        "phone_number",
        "mpin",
        "isAdmin",
        "uuid",
        "status",
      ]);

      await userDetails.update(result);
      const business = (
        await userDetails.getBusinesses({ where: { id: result.businessId } })
      )[0];
      const branch = (
        await business.getBranches({ where: { id: result.branchId } })
      )[0];
      if (user.isAdmin && req.body.action === "activate") {
        result.branch_status = branchStatus.STATUS_ACTIVE;
        result.activated_by_id = user.id;
        result.activated_by_name = user.name;
        result.activated_time = new Date();
        result.business_status = branchStatus.STATUS_ACTIVE;
      } else if (user.isAdmin && req.body.action === "reject") {
        result.branch_status = branchStatus.STATUS_REJECT;
        result.business_status = branchStatus.STATUS_REJECT;
        result.rejected_by_id = user.id;
        result.rejected_by_name = user.name;
        result.rejected_time = new Date();
      } else if (user.isAdmin && req.body.action === "verify") {
        result.branch_status = branchStatus.STATUS_VERFIED;
        result.business_status = branchStatus.STATUS_VERFIED;
        result.verified_by_id = user.id;
        result.verified_by_name = user.name;

        result.verified_time = new Date();
      }
      await business.update(result);
      await branch.update(result);

      // await user.setBusiness(result);

      res.json(
        responseHandler.returnSuccess(
          httpStatus.OK,
          "Success",
          user,
          business,
          branch
        )
      );
    } catch (e) {
      console.error(e);
      res.json(
        responseHandler.returnError(
          httpStatus.BAD_REQUEST,
          "Invalid request, pass right ids"
        )
      );
    }
  };

  getDashboardDetails = async (req, res) => {
    const { user } = req;

    // const businessesCount = (await user.getBusinesses({
    //   attributes: [
    //     [sequelize.fn('COUNT', sequelize.col('id')), 'total_business_count'],
    //   ],
    //   raw:true
    // }))[0];

    const businesses = await user.getBusinesses();

    const businessIds = businesses.map((value) => value.id);
    const pendingForActivationBranches =
      await this.branchService.branchDao.findByWhere({
        businessId: { [Op.in]: businessIds },
        branch_status: { [Op.lt]: branchStatus.STATUS_ACTIVE },
      });

    // console.log(businessesCount);

    return res.json(
      responseHandler.returnSuccess(httpStatus.OK, "Success", {
        businessIds,
        pendingForActivationBranches,
      })
    );
  };

  curdUserAssociated = async (req, res) => {
    const { source, target } = req.params;
    const { id } = req.body;
    req.body = omit(req.body, [
      "mpin",
      "id",
      "isAdmin",
      "uuid",
      "status",
    ]);
    crudOperations({ req, res, source, target, id });
  };

  curdUserAssociatedTwoTargets = async (req, res) => {
    const { source, sourceId, target1, target2, target1Id, target2Id } =
      req.params;
    const { id } = req.body;
    req.body = omit(req.body, [
      "mpin",
      "id",
      "business_id",
      "user_id",
      "isAdmin",
      "uuid",
      "status",
    ]);
    crudOperationsTwoTargets({
      req,
      res,
      sourceId,
      source,
      target1,
      target2,
      target1Id,
      target2Id,
      id,
    });
  };
}

module.exports = ProfileController;
