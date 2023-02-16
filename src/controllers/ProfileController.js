const httpStatus = require("http-status");
const AuthService = require("../service/AuthService");
const TokenService = require("../service/TokenService");
const BranchService = require("../service/BranchService");
const PermissionService = require("../service/PermissionService");
const ModuleService = require("../service/ModuleService");
const RolepermissionService = require("../service/RolepermissionService");
const AttendanceService = require("../service/AttendanceService");
const ItemvariantService = require("../service/ItemvariantService");
const RoleService = require("../service/RoleService");
const ItemService = require("../service/ItemService");
const RoleuserService = require("../service/RoleuserService");
const RolebranchService = require("../service/RolebranchService");
const KitchenService = require("../service/KitchenService");
const PrinterService = require("../service/PrinterService");

const QRCode = require('qrcode')
const PDFDocument = require('pdfkit');
const fs = require('fs');

const ApprovalService = require("../service/ApprovalService");
const TableService = require("../service/TableService");
const ItemcategoryService = require("../service/ItemcategoryService");


const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { createNewOTP, verifyOTP } = require("../helper/otpHelper");
const capitalize = require("capitalize");
const { groupBy } = require("lodash");

const UserService = require("../service/UserService");
const { branchStatus, approvalStatus, userConstant } = require("../config/constant");
const readXlsxFile = require('read-excel-file/node')
const { removeAbsolutePath, itemMappings, getIdsFromArray } = require("./../helper/utilHelper");
const {
  crudOperations,
  crudOperationsTwoTargets,
} = require("../helper/utilHelper");
const { v4: uuidv4 } = require('uuid');


const responseHandler = require("../helper/responseHandler");
const { omit } = require("lodash");
const BusinessService = require("../service/BusinessService");
const RoleuserbranchService = require("../service/RoleuserbranchService");
const FloorService = require("../service/FloorService");
const KitchenbranchcategoriesService = require("../service/KitchenbranchcategoriesService");

class ProfileController {
  constructor() {
    this.userService = new UserService();

    this.tokenService = new TokenService();
    this.businessService = new BusinessService();

    this.branchService = new BranchService();
    this.roleuserService = new RoleuserService();
    this.roleuserbranchService = new RoleuserbranchService();
    this.authService = new AuthService();
    this.permissionService = new PermissionService();
    this.moduleService = new ModuleService();
    this.rolePermissionService = new RolepermissionService();
    this.approvalService = new ApprovalService();
    this.attendanceService = new AttendanceService();
    this.itemvariantService = new ItemvariantService();
    this.roleService = new RoleService();
    this.rolebranchService = new RolebranchService();
    this.itemService = new ItemService();
    this.floorService = new FloorService();
    this.tableService = new TableService();
    this.itemCategoryService = new ItemcategoryService();
    this.kitchenbranchcategoriesService = new KitchenbranchcategoriesService();
    this.kitchenService = new KitchenService()
    this.printerService = new PrinterService()

    // this.addUser1();

  }

  getBusinessTypes = async (req, res) => {

    const businessTypes = await req.user.getBusinesses({ attributes: ['business_type_label', 'business_type_id'] })

    res.json(responseHandler.returnSuccess(httpStatus.OK, "Success", businessTypes));

  }

  getBusiness = async (req, res) => {
    const business = await this.businessService.businessDao.getAll({ user: req.user, ...req.body?.pagination });
    res.send(responseHandler.returnSuccess(httpStatus[200], "Success", business));
  }

  getBranch = async (req, res) => {
    const branch = await this.branchService.branchDao.getAll({ user: req.user, ...req.body?.pagination });
    res.send(responseHandler.returnSuccess(httpStatus[200], "Success", branch));
  }

  findUser = async (req, res) => {

    const { id, phone_number, id_proof_type, id_proof_no, acknowledged } = req.body;
    let user;
    if (id) {
      user = await this.userService.userDao.findById(id);
    }
    else if (phone_number) {
      user = await this.userService.userDao.findByPhoneNumber(phone_number);
    }
    else if (id_proof_type) {
      user = await this.userService.userDao.findOneByWhere({ where: { [id_proof_type]: id_proof_no } });

    }
    if (user) {
      const phone_number = user.phone_number?.slice(0, 2) + user.phone_number?.slice(2).replace(/.(?=...)/g, '*')
      if (acknowledged) {
        const hash = await createNewOTP(phone_number);
        res.json(responseHandler.returnSuccess(httpStatus.OK, "OTP sent successfully", { id: user.id, phone_number, hash }))

      }
      else {
        res.json(responseHandler.returnSuccess(httpStatus.OK, "User Found", { phone_number }))

      }

    }
    else {
      res.json(responseHandler.returnSuccess(httpStatus.OK, "User not found"))

    }
  }

  getBusinesstypeBusinessBranch = async (req, res) => {

    const { user } = req;
    console.log(user);
    const businessTypes = await user.getBusinesses({ attributes: ['id', 'business_name', 'business_type_label', 'business_type_id'], include: { model: this.branchService.branchDao.Model, attributes: ['id', 'branch_name'] }, ...req.body.pagination })
    const groupByStatus = groupBy(businessTypes, "business_type_label");
    const groups = Object.keys(groupByStatus).map((statusGroup) => {


      return { businessType: statusGroup, business: groupByStatus[statusGroup] }
    });
    res.json(responseHandler.returnSuccess(httpStatus.OK, 'success', groups))
  }

  getUser = async (req, res) => {

    const { hash, phone_number, otp, id } = req.body;

    if (!verifyOTP(phone_number, hash, otp)) {

      return res.json(responseHandler.returnError(
        httpStatus.BAD_REQUEST,
        "Invalid OTP"
      ));
    }

    const user = await this.userService.userDao.findById(id);
    if (user == null) {
      return res.json(responseHandler.returnError(
        httpStatus.OK,
        "User not found"
      ));
    }
    return res.json(responseHandler.returnSuccess(
      httpStatus.OK,
      "User found",
      user
    ));

  }

  // x days leave means 
  // feedback last day as relieving day
  getReportingUsers = async (req, res) => {


    try {

      const { user } = req;
      console.log(user.dataValues?.id)

      const data = await this.userService.userDao.findAll({ where: { reporting_user_id: user.dataValues?.id } })

      res.json(responseHandler.returnSuccess(httpStatus.OK, "Success", data))

    } catch (error) {
      res.json(responseHandler.returnError(httpStatus.BAD_REQUEST, 'Error', error))

    }

  }

  getRolesEligibleForReporting = async (req, res) => {

    try {

      const { user } = req;

      const { branch_id, business_type_id } = user;

      const roles = await this.getRolesForUser(user, business_type_id, 'Yes', branch_id)


      res.json(responseHandler.returnSuccess(httpStatus.OK, "Success", roles))

    }
    catch (err) {

    }
  }

  deleteUser = async (req, res) => {

    let approval;
    try {
      let { user, body } = req;
      body = { role_id: '', role_name: '', branch_id: '', businessId_: "" }
      const isApproval = true

      const userById = await this.userService.userDao.Model.findByPk(body.id);
      let models = [];
      if (userById) {

        if (isApproval) {
          models.push({ id: userById.id, name: 'user', action: 'update', value: body })

        }
        else {
          data = await userById.update(body);

        }
      }

      if (isApproval) {
        approval = await user.createApproval({ approver_id: user.reporting_user_id, models, status: approvalStatus.STATUS_PENDING })
      }
      let data = isApproval ? { status: 'Pending with approval', approval_id: approval.id } : null;

      res.json(responseHandler.returnSuccess(httpStatus.OK, "Success", data))
    } catch (error) {
      console.error(error);
      res.json(responseHandler.returnError(httpStatus.BAD_REQUEST, 'Error', error))
    }

  }
  disableUser = async (req, res) => {

    let approval;
    try {
      let { user, body } = req;
      body = { status: userConstant.STATUS_DISABLED }
      const isApproval = user.role_id !== 'OWNER'

      const userById = await this.userService.userDao.Model.findByPk(body.id);
      let models = [];
      if (userById) {

        if (isApproval) {
          models.push({ id: userById.id, name: 'user', action: 'update', value: body })

        }
        else {
          data = await userById.update(body);

        }
      }
      console.log({ models })
      if (isApproval) {
        approval = await user.createApproval({ approver_id: user.reporting_user_id, models, status: approvalStatus.STATUS_PENDING })
      }
      let data = isApproval ? { status: 'Pending with approval', approval_id: approval.id } : null;

      res.json(responseHandler.returnSuccess(httpStatus.OK, "Success", data))
    } catch (error) {
      console.error(error);
      res.json(responseHandler.returnError(httpStatus.BAD_REQUEST, 'Error', error))
    }



  }

  addUser = async (req, res) => {

    try {
      let { user, body } = req;
      body = { ...body, status: userConstant.STATUS_ACTIVE }
      console.log(body)
      const isApproval = user.role_id !== 0
      // || true

      const userbyPhone = await this.userService.userDao.findByPhoneNumber(body.phone_number);
      let models = [];
      let data = isApproval ? { status: 'Pending with approval' } : null;
      if (userbyPhone) {

        if (isApproval) {
          models.push({ id: userbyPhone.id, name: 'user', action: 'update', value: body })

        }
        else {
          data = await userbyPhone.update(body);

        }
      }
      else {
        if (isApproval) {

          models.push({ id: user.id, name: 'user', action: 'createUser', value: body })
        }
        else {
          data = await user.createUser(body);

        }

      }
      const emp_data = { ...body, joined_by: user.dataValues.id }
      if (isApproval) {
        models.push({ id: 'PREVIOUS_CHAIN', name: 'user', action: 'createEmployment', value: emp_data })
        models.push({ id: 'PREVIOUS_CHAIN2', name: 'user', action: 'createRoleuser', value: { role_id: body.role.id } })

        models.push({ id: 'PREVIOUS_CHAIN', name: 'roleuser', action: 'addBranches', value: [...(body.additional_branch_ids ?? []), data.branch_id] })

      }
      else {
        const emp = await data.createEmployment(emp_data);
        console.log(emp);
        const roleuser = await data.createRoleuser({ role_id: data.role_id });
        // console.log(ch)
        // const roleuser =  await this.roleuserService.roleuserDao.Model.findAll({role_id:data.role_id,user_id:data.dataValues.id})
        console.log({ roleuser });

        await roleuser.addBranches([...(body.additional_branch_ids ?? []), data.branch_id])
      }


      if (isApproval) {
        await user.createApproval({ approver_id: user.reporting_user_id, models, status: approvalStatus.STATUS_PENDING })
      }
      res.json(responseHandler.returnSuccess(httpStatus.OK, "Success", data))
    } catch (error) {
      console.error(error);
      res.json(responseHandler.returnError(httpStatus.BAD_REQUEST, 'Error', error))
    }

  }


  addUser1 = async (req, res) => {
    const { user, body } = req;


    const { branch_id, business_id, phone_number, additional_branches, modules, role_id } = body;
    const { id, owner_id, is_owner, roleuser_id } = user;
    const dao = this.userService.userDao
    const branches = [branch_id, ...additional_branches]
    const hasAccess = await this.roleuserService.hasAccessToBranchandBusiness({ is_owner, id, roleuser_id, branch_id: branches, businesses: [business_id] });

    if (!hasAccess) {
      return res.json(responseHandler.returnError(httpStatus.UNAUTHORIZED, 'No access to business or branch'))
    }
    const uuid = uuidv4();

    const details = { ...body, uuid, user_id: id, joined_by: id, owner_id }
    let employee = await dao.findByPhoneNumber(phone_number)
    if (employee) {
      await dao.updateById(details, employee.id);
      console.log('user already exist with us')
    } else {
      employee = await dao.create(details);
      console.log('user is newly created');

    }

    const roleuser = await employee.createRoleuser({ role_id });
    employee.update({ roleuser_id: roleuser.dataValues.id })
    await roleuser.addBranches(branches);
    await roleuser.addModules(modules);


    res.json(hasAccess)


  }


  getRolesForUser = async (user, business_type_id, is_approval_authority, branch_id) => {


    branch_id = branch_id ?? user.branchId
    let option = {
      include: this.permissionService.permissionDao.Model,


      // attributes:['id','name','is_approval_authority','business_type_id','business_type_label','userId']
    }
    if (business_type_id) {
      option['where'] = { ...option['where'], business_type_id: parseInt(business_type_id) }
    }
    if (is_approval_authority) {
      option['where'] = { ...option['where'], is_approval_authority }

    }
    if (branch_id) {

      const temprolebranch = await this.rolebranchService.rolebranchDao.findByWhere({ where: { branch_id }, raw: true })
      console.log(temprolebranch)
      const id = temprolebranch.map(({ roleId }) => roleId);
      option['where'] = { ...option['where'], id }
      console.log(option)
    }
    const roles = await this.roleService.roleDao.getAll(option);
    return roles;
  }
  getRoles = async (req, res) => {
    const { user, query } = req;
    let { business_type_id, is_approval_authority, branch_id } = query;
    if (branch_id) {


      const hasAccess = await this.checkBranchAccess(user, res, branch_id);
      if (hasAccess) {
        return res.json(hasAccess)
      }
    }
    else {
      branch_id = await this.roleuserbranchService.getBranches(user)

    }
    console.log({ branch_id })
    const roles = await this.getRolesForUser(user, business_type_id, is_approval_authority, branch_id)
    res.json(responseHandler.returnSuccess(httpStatus.OK, "Success", roles));
  };


  getObjfromMappings = (header, row, business_id) => {

    // console.log(row)
    return header.reduce((prev, current, index) => {
      // console.log(prev[itemMappings[current]],prev,current,row[index])
      prev[itemMappings[current]] = row[index]
      return prev
    }, { business_id })

  }

  getAllItems = async (req, res) => {

    const { user } = req;
    console.log(user)
    const branch = await this.branchService.branchDao.Model.findByPk(user.get().business_id);
    const items = await branch.getItems({ include: this.itemvariantService.itemvariantDao.Model })
    res.json(responseHandler.returnSuccess(httpStatus.OK, 'Success', items))
  }

  findNextNum = (dish_code, k) => {
    // console.log(dish_code, typeof dish_code)
    if (dish_code.includes(k)) {
      return this.findNextNum(dish_code, ++k)
    }
    else {
      return k
    }

  }
  getItemsWithCategory = async (req, res) => {
    const { user, query, body, isCategoryOnly } = req;
    const { pagination } = body;
    const category = query.category;
    const business_id = user.get().business_id
    let items = await this.itemService.itemDao.getDataTableData({ ...(!!isCategoryOnly && { attributes: [Sequelize.fn('DISTINCT', Sequelize.col('category')), 'category'] }), where: { ...(!!category && { category }), business_id }, ...(!!!isCategoryOnly && { include: this.itemvariantService.itemvariantDao.Model }), ...pagination })
    // const branch = await this.branchService.branchDao.Model.findByPk();
    // const items = await branch.getItems({ include: this.itemvariantService.itemvariantDao.Model })
    console.log({ items })
    if (isCategoryOnly) {
      items = items.rows.map(({ category }) => category)
    }

    res.json(responseHandler.returnSuccess(httpStatus.OK, 'Success', items))

  }
  onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }

  uploadItems = async (req, res) => {

    const { file, business_id } = req.body;

    //TODO, check business acess
    let k = 0;
    const business = await this.businessService.businessDao.Model.findByPk(business_id);
    console.log(business_id, business)
    const categories = []
    readXlsxFile('registration/' + removeAbsolutePath(file)).then(async (rows) => {
      const header = rows[0];
      let item;
      let dish_codes_obj = await this.itemvariantService.itemvariantDao.Model.findAll({ raw: true, attributes: ['dish_code'] });
      let dish_code = dish_codes_obj.map(({ dish_code }) => dish_code);

      for (let i = 1; i <= rows.length - 1; i++) {

        k = this.findNextNum(dish_code, k)
        const row = rows[i]
        let value = this.getObjfromMappings(header, row, business_id);
        value['dish_code'] = value['dish_code'] ?? k

        if (value['item_generic_name']) {
          item = await business.createItem(value)
          categories.push(item.category)
        }

        if (value['name']) {
          dish_code.push(value['dish_code']);

        }

      }
      const unique = categories.filter(this.onlyUnique);
      for (let ct of unique) {
        if (!(await this.itemCategoryService.itemcategoryDao.checkExist({ name: ct }))) {
          await this.itemCategoryService.itemcategoryDao.create({ name: ct, business_id });

        }
      }

      res.json(rows)
    })

  }

  getModulesForRole = async (req, res) => {
    const { query } = req;
    const { roleId: role_id } = query;

    const rolePermission = await this.rolePermissionService.rolepermissionDao.Model.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('module')), 'module']],
      raw: true,
      where: { role_id }
    })
    // const roleBranch = await this.rolebranchService.rolebranchDao.Model.findAll({
    //   attributes: [ 'branch_id'],
    //   include:{model:this.branchService.branchDao.Model, through: {
    //     attributes: ['createdAt', 'startedAt', 'finishedAt'],
    //     where: {
    //       role_id: role_id
    //     }
    // } },
    //   raw: true,
    //   where: { role_id }
    // })

    const roleBranch = await this.roleService.roleDao.findOneByWhere({ where: { id: role_id }, include: { model: this.branchService.branchDao.Model, attributes: ['id', 'branch_name', "businessId"] } })
    console.log(roleBranch)

    res.json(responseHandler.returnSuccess(httpStatus.OK, "Success", { modules: rolePermission.map(({ module }) => module), branches: roleBranch.dataValues.branches }))

  }

  getFncName() {
    const stackLine = (new Error()).stack.split('\n')[2].trim()
    const fncName = stackLine.match(/at Object.([^ ]+)/)?.[1]
    return fncName
  }
  initalChecks = async ({ model, req, res, branch_id, method }) => {


    const { user, isApprovalFlow } = req;
    let shouldReturn = false
    let reason = ""
    if (!isApprovalFlow) {
      const hasAccess = await this.checkBranchAccess(user, res, [branch_id])
      if (hasAccess) {
        shouldReturn = true;
        reason = "access"
        res.json(hasAccess);
        return { shouldReturn, reason };
      }
      const isAppr = await this.checkandupdateApproval({ ...req, model }, method);
      console.log({ isAppr })
      if (isAppr) {
        shouldReturn = true;
        res.json(isAppr)
        reason = "approval"

        return { shouldReturn, reason };
      }
    }
    else if (model) {
      await model.update({ approval_id: 0, approval_action: '' })
    }

    return { shouldReturn, reason };

  }

  getAvailableItemCategoryForKitchen = async (req, res) => {

    let { branch_id } = req.query;
    // branch_id = getIdsFromArray(branch_id);

    const { shouldReturn, reason } = await this.initalChecks({ req, res, branch_id: [branch_id], method: 'addKitchen' })
    console.log(shouldReturn, reason)
    if (shouldReturn) {
      return;
    }

    // const branch = await this.branchService.getBranchFromBranchId(branch_id)
    const kitchencategories = await this.kitchenbranchcategoriesService.kitchenbranchcategoriesDao.findByWhere({ where: { branch_id }, raw: true })
    console.log(kitchencategories)
    const ct = kitchencategories.map(({ itemcategoryId }) => itemcategoryId)
    console.log({ ct })
    const availableitemcategories = await this.itemCategoryService.itemcategoryDao.findByWhere({ where: { id: { [Op.notIn]: ct } } })

    res.send(responseHandler.returnSuccess(httpStatus[200], "Success", availableitemcategories))

  }

  addKitchen = async (req, res) => {

    const { body } = req;

    let { branch_id, categories, id } = body;
    // branch_id = getIdsFromArray(branch_id);

    const { shouldReturn, reason } = await this.initalChecks({ req, res, branch_id: [branch_id], method: 'addKitchen' })
    console.log(shouldReturn, reason)
    if (shouldReturn) {
      return;
    }

    const branch = await this.branchService.getBranchFromBranchId(branch_id)
    let kitchen;
    if (id) {
      kitchen = await this.kitchenService.kitchenDao.findById(id);
      console.log({ kitchen, id })
      await kitchen.update(body)
      if (categories) {
        await this.kitchenbranchcategoriesService.kitchenbranchcategoriesDao.deleteByWhere({ kitchen_id: id })
      }
    }
    else {
      kitchen = await branch.createKitchen(body);

    }
    if (categories) {
      for (let itemcategory of categories) {
        const item = await this.itemCategoryService.itemcategoryDao.findById(itemcategory);
        await kitchen.addItemcategory(item, { through: { branch_id } })
      }
    }

    res.json(responseHandler.returnSuccess(httpStatus[200], "Success", kitchen))
  }

  getKitchen = async (req, res) => {

    const { body } = req;

    let { branch_id } = body;
    // branch_id = getIdsFromArray(branch_id);

    const { shouldReturn, reason } = await this.initalChecks({ req, res, branch_id: [branch_id], method: 'deleteKitchen' })
    console.log(shouldReturn, reason)
    if (shouldReturn) {
      return;
    }

    // const branch = await this.branchService.getBranchFromBranchId(branch_id)

    const kitchens = await this.kitchenService.kitchenDao.getAll({ include: this.itemCategoryService.itemcategoryDao.Model })


    res.json(responseHandler.returnSuccess(httpStatus[200], "Success", kitchens))
  }

  deleteKitchen = async (req, res) => {

    const { body } = req;

    let { branch_id, id } = body;
    // branch_id = getIdsFromArray(branch_id);

    const { shouldReturn, reason } = await this.initalChecks({ req, res, branch_id: [branch_id], method: 'deleteKitchen' })
    console.log(shouldReturn, reason)
    if (shouldReturn) {
      return;
    }

    // const branch = await this.branchService.getBranchFromBranchId(branch_id)

    await this.kitchenService.kitchenDao.deleteByWhere({ id, branch_id })


    res.json(responseHandler.returnSuccess(httpStatus[200], "Success"))
  }



  addFloor = async (req, res) => {
    const { body } = req;

    let { branch_id, floors, tables } = body;
    // branch_id = getIdsFromArray(branch_id);

    const { shouldReturn, reason } = await this.initalChecks({ req, res, branch_id: [branch_id], method: 'addFloor' })
    console.log(shouldReturn, reason)
    if (shouldReturn) {
      return;
    }

    const branch = await this.branchService.getBranchFromBranchId(branch_id)
    let floor = {};
    if (!floors) {
      const lastFloor = await this.floorService.floorDao.findOneByWhere({ order: ['sNo', 'DESC'], attributes: ['sNo'], raw: true });
      console.log({ lastFloor })
      const lastFloorVal = lastFloor?.sNo;

      floor = await branch.createFloor({ ...body, sNo: lastFloorVal !== null ? lastFloorVal + 1 : 1 });
      for (let t of tables) {
        await floor.createTable(t)

      }
    }
    else {
      for (let tt of floors) {
        await this.floorService.floorDao.updateById(tt, tt.id)
        for (let t of tt.tables) {
          await this.tableService.tableDao.updateById(t, t.id)
        }

      }
    }
    res.send(responseHandler.returnSuccess(httpStatus[200], "Success", floor))

  }


  addPrinter = async (req, res) => {
    const { body } = req;

    let { branch_id, printers } = body;
    // branch_id = getIdsFromArray(branch_id);

    const { shouldReturn, reason } = await this.initalChecks({ req, res, branch_id: [branch_id], method: 'addPrinter' })
    console.log(shouldReturn, reason)
    if (shouldReturn) {
      return;
    }

    const branch = await this.branchService.getBranchFromBranchId(branch_id)
    let printer;
    if (printers) {
      for (let pp of printers) {
        printer = await this.printerService.printerDao.findById(pp.id);
        await printer.update(pp)
      }


    }
    else {
      const lastPrinter = await this.printerService.printerDao.findOneByWhere({ order: ['sNo', 'DESC'], attributes: ['sNo'], raw: true });
      console.log(lastPrinter)
      const lastPrinterVal = lastPrinter?.sNo;

      printer = await branch.createPrinter({ ...body, sNo: lastPrinterVal !== null ? lastPrinterVal + 1 : 1 });

    }

    res.json(responseHandler.returnSuccess(httpStatus[200], "Success", printer))

  }

  deletePrinter = async (req, res) => {

    const { body } = req;

    let { branch_id, id } = body;
    // branch_id = getIdsFromArray(branch_id);

    const { shouldReturn, reason } = await this.initalChecks({ req, res, branch_id: [branch_id], method: 'deletePrinter' })
    console.log(shouldReturn, reason)
    if (shouldReturn) {
      return;
    }

    // const branch = await this.branchService.getBranchFromBranchId(branch_id)

    await this.printerService.printerDao.deleteByWhere({ id, branch_id })


    res.json(responseHandler.returnSuccess(httpStatus[200], "Success"))

  }




  deleteTable = async (req, res) => {

    const { body } = req
    let { branch_id, floor_id, table_id } = body;


    const { id } = await this.floorService.getFloorFromFloorandBranchId({ floor_id, branch_id })
    console.log(id, { floor_id: id, id: table_id });
    if (!id) {
      return res.json(responseHandler.returnError(httpStatus.UNAUTHORIZED, "Error"))
    }
    // branch_id = getIdsFromArray(branch_id);
    const table = await this.tableService.tableDao.findOneByWhere({ floor_id: id, id: table_id })
    const { shouldReturn, reason } = await this.initalChecks({ model: table, req, res, branch_id: [branch_id], method: 'deleteTable' })
    console.log({ shouldReturn, reason })
    if (shouldReturn) {
      return;
    }


    res.json(responseHandler.returnSuccess(httpStatus[200], "Success", {}))

  }

  deleteFloor = async (req, res) => {

    const { body } = req
    let { branch_id, floor_id } = body;


    const { id } = await this.floorService.getFloorFromFloorandBranchId({ floor_id, branch_id })
    if (!id) {
      return res.json(responseHandler.returnError(httpStatus.UNAUTHORIZED, "Error"))
    }
    // branch_id = getIdsFromArray(branch_id);
    await this.floorService.floorDao.deleteByWhere({ id })

    res.json(responseHandler.returnSuccess(httpStatus[200], "Success", {}))

  }

  getPrinterLocations = async (req, res) => {

    const { body } = req;
    let { branch_id } = body;

    const { shouldReturn, reason } = await this.initalChecks({ req, res, branch_id: [branch_id], method: 'getPrinterLocations' })
    console.log(shouldReturn, reason)
    if (shouldReturn) {
      return;
    }

    // branch_id = getIdsFromArray(branch_id);
    const floors = await this.floorService.floorDao.findByWhere({ branch_id })
    const kitchen = await this.kitchenService.kitchenDao.findByWhere({ branch_id })

    const data = [{ name: 'Cash', type: 'others' }, ...floors.map(({ name, id }) => ({ name, id, type: 'floor' })), ...kitchen.map(({ name, id }) => ({ name, id, type: 'kitchen' }))]
    res.json(responseHandler.returnSuccess(httpStatus[200], "Success", data))


  }

  addTable = async (req, res) => {
    const { body } = req;

    let { branch_id, floor_id, tables } = body;
    // branch_id = getIdsFromArray(branch_id);

    const floor = await this.floorService.getFloorFromFloorandBranchId({ floor_id, branch_id })

    const { shouldReturn, reason } = await this.initalChecks({ req, res, model: floor, branch_id: [branch_id], method: 'addTable' })
    console.log(shouldReturn, reason)
    if (shouldReturn) {
      return;
    }
    let table = {};
    if (!tables) {
      const lastTable = await this.tableService.tableDao.findOneByWhere({ order: ['sNo', 'DESC'], attributes: ['sNo'], raw: true });
      const lastTableVal = lastTable?.sNo;
      table = await floor.createTable({ ...body, sNo: lastTableVal !== null ? lastTableVal + 1 : 1 });

    }
    else {
      for (let tt of tables) {

        const uu = await this.userService.userDao.findById(tt.userId)
        console.log(tt.userId);
        if (uu) {
          const hasAccess = await this.checkBranchAccess(uu, res, [branch_id])
          console.log({ hasAccess })
          if (!hasAccess) {

            tt = { ...tt, user_id: tt.userId }

          }
          console.log({ tt })

          await this.tableService.tableDao.updateById(tt, tt.id)
        }

      }

    }

    res.send(responseHandler.returnSuccess(httpStatus[200], "Success", table))
  }


  generateQrCodeForTables = async (req, res) => {
    const { body } = req;

    let { branch_id, floor_id, tables } = body;
    // branch_id = getIdsFromArray(branch_id);

    const floor = await this.floorService.getFloorFromFloorandBranchId({ floor_id, branch_id })

    const { shouldReturn, reason } = await this.initalChecks({ req, res, model: floor, branch_id: [branch_id], method: 'generateQrCodeForTables' })
    console.log(shouldReturn, reason)
    if (shouldReturn) {
      return;
    }
    console.log({ branch_id })
    const branch = await this.branchService.branchDao.findById(branch_id, { raw: true, attributes: ['branch_name', 'businessId'] })

    const business = await this.businessService.businessDao.findById(branch.businessId, { raw: true, attributes: ['business_name'] })
    console.log({ business })

    const doc = new PDFDocument({ autoFirstPage: false })
    doc.pipe(fs.createWriteStream('./tableQR.pdf'))


    // Embed a font, set the font size, and render some text

    for (let tt of tables) {
      const table = await this.tableService.tableDao.findById(tt.id);
      if (table) {
        const { name, id, capacity, status } = table.dataValues
        console.log({ name, id, capacity, status, floor_name: floor.name, floor_id, branch_id, branch_name: branch.branch_name })
        console.log('done', JSON.stringify({ type: 'TABLE_QR', name, id, capacity, status, floor_name: floor.name, floor_id, branch_id, branch_name: branch.branch_name, business_name: business.business_name }))



        //Add an image, constrain it to a given size, and center it vertically and horizontally 




        // doc.addPage()
        //    .image('./1.png', {
        //    fit: [500,400],
        //    align: 'center',
        //    valign: 'center'
        // });
        doc.addPage();

        doc
          .font('./src/fonts/Amita-Bold.ttf')

          .fontSize(24)
          .fillColor('#C8073B')
          .text('Mabliz', { align: 'center' });
        //       doc.moveTo(0, 200)       // this is your starting position of the line, from the left side of the screen 200 and from top 200
        //  .lineTo(400, 200)       // this is the end point the line 
        //   doc.moveTo(0, 200)   //again we are giving a starting position for the text
        // //adding dash
        //  .stroke()

        doc
          .font('./src/fonts/JosefinSans-SemiBold.ttf').
          fontSize(20)
          .fillColor('#170408')
          .text("Contactless Dining", { align: 'center' })
          ;

        doc
          .fontSize(15)
          .fillColor('#6D6D72')
          .text("Scan & Order Now", { align: 'center' });


        // Add an image, constrain it to a given size, and center it vertically and horizontally
        doc.image('./filename.png', {

          align: 'center',
          valign: 'center'


        });
        doc.lineWidth(5).rect(0, 0, doc.page.width, doc.page.height);
        doc.stroke();

        doc.lineWidth(1).rect(8, 8, doc.page.width - 16, doc.page.height - 16);
        doc.stroke();

        doc
          .fontSize(20)
          .moveUp(0.5)
          .fillColor('#AAAEAE')
          .text(floor.name +
            " / " + table.name, { align: 'center' });

        doc.moveDown()
        doc
          .moveDown(0.75)
          .font('./src/fonts/Raleway-Medium.ttf')

          .fontSize(20)
          .fillColor('#0D1923')
          .text(business.business_name, { align: 'center' });
        doc
          .fontSize(15)
          .fillColor('#AAAEAE')
          .text(branch.branch_name, { align: 'center' });
        // Add another page

        // Add some text with annotations

        // Finalize PDF file
        console.log(tt);
      }
    }

    // doc.removePage(i-1);

    doc.end();

    //Pipe its output somewhere, like to a file or HTTP response 
    //See below for browser usage 
    console.log('download')

    setTimeout(() => {
      res.download('./tableQR.pdf')

    }, 1000)



  }


  getTable = async (req, res) => {
    const { body } = req;

    let { branch_id, floor_id } = body;
    // branch_id = getIdsFromArray(branch_id);

    const floor = await this.floorService.getFloorFromFloorandBranchId({ floor_id, branch_id })

    const { shouldReturn, reason } = await this.initalChecks({ req, res, model: floor, branch_id: [branch_id], method: 'getTable' })
    console.log(shouldReturn, reason)
    if (shouldReturn) {
      return;
    }

    const tables = await this.tableService.tableDao.getAll({ where: { floor_id }, include: { model: this.userService.userDao.Model, attributes: ['name', 'id', 'owner_id', 'user_status'] } });

    res.json(responseHandler.returnSuccess(httpStatus[200], 'Success', tables));

  }

  getFloor = async (req, res) => {

    const { body } = req;

    let { branch_id } = body;
    // branch_id = getIdsFromArray(branch_id);


    const { shouldReturn, reason } = await this.initalChecks({ req, res, branch_id: [branch_id], method: 'getFloor' })
    console.log(shouldReturn, reason)
    if (shouldReturn) {
      return;
    }

    const floors = await this.floorService.floorDao.getAll({ where: { branch_id }, include: { model: this.tableService.tableDao.Model } });

    res.json(responseHandler.returnSuccess(httpStatus[200], 'Success', floors));

  }


  getPrinter = async (req, res) => {

    const { body } = req;

    let { branch_id } = body;
    // branch_id = getIdsFromArray(branch_id);


    const { shouldReturn, reason } = await this.initalChecks({ req, res, branch_id: [branch_id], method: 'getFloor' })
    console.log(shouldReturn, reason)
    if (shouldReturn) {
      return;
    }

    const printers = await this.printerService.printerDao.getAll({ where: { branch_id } });

    
    res.json(responseHandler.returnSuccess(httpStatus[200], 'Success', printers));

  }

  assignUsersToTables = async (req, res) => {
    const { body } = req;

    let { branch_id, floor_id, tables } = body;
    // branch_id = getIdsFromArray(branch_id);

    const floor = await this.floorService.getFloorFromFloorandBranchId({ floor_id, branch_id })

    const { shouldReturn, reason } = await this.initalChecks({ req, res, model: floor, branch_id: [branch_id], method: 'addTable' })
    console.log(shouldReturn, reason)
    if (shouldReturn) {
      return;
    }
    let table = {};
    if (!tables) {
      const lastTable = await this.tableService.tableDao.findOneByWhere({ order: ['sNo', 'DESC'], attributes: ['sNo'], raw: true });
      const lastTableVal = lastTable?.sNo;
      table = await floor.createTable({ ...body, sNo: lastTableVal !== null ? lastTableVal + 1 : 1 });

    }
    else {
      for (let tt of tables)
        await this.tableService.tableDao.updateById(tt, tt.id)
    }

    res.send(responseHandler.returnSuccess(httpStatus[200], "Success", table))

  }

  getAllBranchesOfUser = async (req, res) => {

    const businesses = await this.businessService.businessDao.getAll({ user: req.user, attributes: ['id', 'business_name'], include: { model: new BranchService().branchDao.Model, attributes: ['id', 'branch_name', 'businessId'] }, ...req.body.pagination })
    res.json(responseHandler.returnSuccess(httpStatus[200], "Success", businesses))
  }
  getUsersForRole = async (req, res) => {
    const { user, query } = req;
    const { role_id } = query;
    console.log(user.owner_id, role_id)
    if (role_id == 0) {

      const owner = await this.userService.userDao.findByWhere({ where: { id: user.owner_id } })
      return res.json(responseHandler.returnSuccess(httpStatus.OK, "Success", owner))
    }

    // this.roleuserService.roleDao.findByWhere({})
    const users = await this.roleService.roleDao.findByWhere({ where: { id: role_id }, include: this.userService.userDao.Model })
    res.json(responseHandler.returnSuccess(httpStatus.OK, "Success", users))
  }

  updateItems = async (req, res) => {
    const { body } = req;

    const { id, itemvariants } = body;
    await this.itemService.itemDao.updateWhere(body, { id })
    if (itemvariants && itemvariants.length > 0) {
      for (let itemvariant of itemvariants) {
        const { id } = itemvariant
        await this.itemvariantService.itemvariantDao.updateWhere(itemvariant, { id })
      }
    }
    res.json(responseHandler.returnSuccess(httpStatus.OK, "Success", {}))

  }

  deleteItem = async (req, res) => {
    const { body } = req;

    const { id } = body;

    await this.itemService.itemDao.deleteByWhere({ id })
    res.json(responseHandler.returnSuccess(httpStatus.OK, "Success", {}))


  }

  deleteItemVariants = async (req, res) => {
    const { body } = req;

    const { id, itemvariants } = body;

    if (itemvariants && itemvariants.length > 0) {
      for (let itemvariant of itemvariants) {
        const { id } = itemvariant
        await this.itemvariantService.itemvariantDao.deleteByWhere({ id })
      }
    }
    const remaining = await this.itemvariantService.itemvariantDao.findByWhere({ item_id: id })
    if (remaining.length === 0) {
      await this.itemService.itemDao.deleteByWhere({ id })
    }
    res.json(responseHandler.returnSuccess(httpStatus.OK, "Success", {}))

  }

  getPendingListForApproval = async (req, res) => {
    const { user } = req;
    const approvals = await this.approvalService.approvalDao.Model.findAll({
      attributes: { exclude: ['models'] },
      approver_id: user.id
    })
    res.json(responseHandler.returnSuccess(httpStatus.OK, "Success", approvals))
  }

  getModelInstance = async (id, modelName) => {
    const Dao = require("./../dao/" + capitalize(modelName) + "Dao");
    const model = new Dao().Model;
    const modelInstance = await model.findByPk(id);

    return modelInstance

  }
  // approveRejectApprovalRequest = async (req, res) => {

  //   try {

  //     const { body, user } = req;

  //     const { id, action, reason } = body;
  //     const approval = await this.approvalService.approvalDao.Model.findByPk(id);
  //     if (user.id !== approval?.approver_id && false) {
  //       console.log(user.id, approval.approver_id)
  //       res.json(responseHandler.returnError(httpStatus.UNAUTHORIZED, 'Not authorized to action this request'))
  //       return;
  //     }
  //     const { models, status } = approval.get();
  //     if (status !== approvalStatus.STATUS_PENDING) {
  //       res.json(responseHandler.returnError(httpStatus.BAD_REQUEST, 'Status is not pending'))
  //       return;
  //     }

  //     if (action === approvalStatus.STATUS_APPROVED) {
  //       console.log(typeof models)
  //       let ids = []

  //       console.log('begin');
  //       let index = 0
  //       for (let item of models) {
  //         const { id, name, action, value } = item;
  //         let updatedId = id;
  //         if (typeof (id) === 'string' && id?.includes('PREVIOUS_CHAIN')) {
  //           const chainid = parseInt(id.split('PREVIOUS_CHAIN')?.[1]) || 1;
  //           updatedId = ids[index - chainid]
  //           console.log({ ids, updatedId, index, chainid }, index - chainid)
  //         }
  //         const modelInstance = await this.getModelInstance(updatedId, name);
  //         console.log({ name, action, value }, updatedId)

  //         await modelInstance[action](value).then((a) => {
  //           console.log({ a })
  //           if (a) {
  //             console.log(a.id, ids)
  //             ids.push(a.id);
  //             console.log(a.id, ids)
  //             return a;
  //           }

  //         })
  //         index += 1;

  //       }
  //       console.log('finished');


  //     }


  //     await approval.update({ status: action, reason })
  //     res.json(responseHandler.returnSuccess(httpStatus.OK, "Success"))

  //   } catch (error) {
  //     console.log(error)
  //     res.json(responseHandler.returnError(httpStatus.BAD_REQUEST, 'Error', error))

  //   }
  // }

  approveRejectApprovalRequest = async (req, res) => {

    try {

      const { body, user } = req;

      const { id, action, reason } = body;
      const approval = await this.approvalService.approvalDao.Model.findByPk(id);
      if (user.id !== approval?.approver_id) {
        console.log(user.id, approval.approver_id)
        res.json(responseHandler.returnError(httpStatus.UNAUTHORIZED, 'Not authorized to action this request'))
        return;
      }
      const { models, status, method, userId } = approval.get();
      if (status !== approvalStatus.STATUS_PENDING) {
        res.json(responseHandler.returnError(httpStatus.BAD_REQUEST, 'Status is not pending'))
        return;
      }

      else if (action === approvalStatus.STATUS_PENDING || true) {
        req.user = await this.userService.userDao.Model.findByPk(userId);
        console.log(req.user, userId)
        req.body = models;
        req.isApprovalFlow = true;
        req.role = {}
        console.log(this[method])
        await approval.update({ status: action, reason })

        await this[method](req, res)
      }


      // res.json(responseHandler.returnSuccess(httpStatus.OK, "Success"))

    } catch (error) {
      console.log(error)
      res.json(responseHandler.returnError(httpStatus.BAD_REQUEST, 'Error', error))

    }
  }


  checkBranchAccess = async (user, res, branch_id, business_id) => {


    const { roleuser_id, is_owner, id } = user;


    const hasAccess = await this.roleuserService.hasAccessToBranchandBusiness({ roleuser_id, is_owner, id, branch_id, business_id });
    console.log(hasAccess)
    if (!hasAccess) {
      return responseHandler.returnError(httpStatus.UNAUTHORIZED, 'No access to business or branch')

    }
    return null;

  }


  checkandupdateApproval = async ({ model, user, role, body }, method) => {
    const { need_approval, module, permission_name } = role ?? {};
    console.log({ module, permission_name })
    if (need_approval) {

      const approval = await user.createApproval({ module, permission_name, approver_id: user.reporting_user_id, models: body, method, status: approvalStatus.STATUS_PENDING })
      model && model.update({ approval_id: approval.dataValues.id, approval_action: permission_name })
      return responseHandler.returnSuccess(httpStatus[200], "Success", { 'request_id': approval.dataValues.id, status: 'Pending with approval' })

    }
    return null;
  }

  addNewRoles = async (req, res) => {
    const { user, body, isApprovalFlow } = req;
    let { permissions, branch_ids, id } = body;
    //TODO
    branch_ids = getIdsFromArray(branch_ids);



    const { shouldReturn } = await this.initalChecks({ req, res, branch_id: branch_ids }, "addNewRoles")
    if (shouldReturn) {
      return;
    }

    let role;
    if (id) {
      role = await this.roleService.roleDao.Model.findByPk(id);
      // await this.rolePermissionService.rolepermissionDao.deleteByWhere({role_id:role.id})
      // await this.rolebranchService.rolebranchDao.deleteByWhere({role_id:role.id})
      await role.update(body)
    }
    else {
      role = await user.createRole(body)
    }


    for (let perm of permissions) {
      const { permission_suffix, need_approval } = perm;
      const permission = await this.permissionService.permissionDao.findOneByWhere({ where: { name: permission_suffix } });
      const split = permission_suffix.split("_");
      await role.addPermissions(permission, { through: { need_approval, module: split[0], permission_name: split[1] } });

    }
    await role.addBranches(branch_ids)


    res.json(responseHandler.returnSuccess(httpStatus.OK, isApprovalFlow ? "Approved and added Successfully" : "Success", role));
  };

  updateRole = async (req, res) => {
    const { body } = req;
    console.log(body);
    const { id, permissions } = body;
    console.log(id, permissions);
    const role = await this.roleService.roleDao.Model.findByPk(id);
    // const role = await user.getRoles({ where: { id } });
    console.log(role);
    await role?.update(body);
    console.log({ role });



    for (let perm of permissions) {
      const { permission_suffix, need_approval } = perm;
      const permission = await this.permissionService.permissionDao.findOneByWhere({ where: { name: permission_suffix } });
      const split = permission_suffix.split("_");
      await role.addPermissions(permission, { through: { need_approval, module: split[0], permission_name: split[1] } });

    }
    res.json(responseHandler.returnSuccess(httpStatus.OK, "Success", role));
  };

  getPermissionDetails = async (req, res) => {
    const { user } = req;
    console.log(user);
    const { is_owner, roleuser_id } = user.dataValues;
    console.log({ is_owner, roleuser_id })
    if (is_owner) {
      return res.json(responseHandler.returnSuccess(httpStatus.OK, 'Success', [{ 'module': 'owner', 'permissions': 'all' }]))

    }
    const { role_id } = await this.roleuserService.roleuserDao.findById(roleuser_id)
    const permissions = await this.rolePermissionService.rolepermissionDao.findByWhere({ where: { role_id }, attributes: ['need_approval', 'module', 'permission_name'], order: ['role_id', 'DESC'] });

    return res.json(responseHandler.returnSuccess(httpStatus.OK, 'Success', permissions))
  }
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


  addAddentance = async (req, res) => {

    const { body, user: reporting } = req;
    for (let item of body) {
      const { id, is_present, rating, rejoinDate } = item
      const user = await this.userService.userDao.Model.findByPk(id);
      const userDetails = user.get()
      if (userDetails.reporting_user_id === reporting.id || true) {
        await user.createAttendance({ is_present, rating, marked_by: reporting.id });
        const updatedUserDetails = { rejoinDate }
        await user.update(updatedUserDetails)
      }
    }
    res.json(responseHandler.returnError(httpStatus.BAD_REQUEST))
  }

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
