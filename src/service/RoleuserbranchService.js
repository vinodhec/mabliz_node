const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const RoleuserbranchDao = require('../dao/RoleuserbranchDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');
const BranchDao = require('../dao/BranchDao');

class RoleuserbranchService {
    constructor() {
        this.roleuserbranchDao = new RoleuserbranchDao();
        this.branchDao = new BranchDao();
    }



}

module.exports = RoleuserbranchService;
