const httpStatus = require('http-status');
const RoleDao = require('../dao/RoleDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');
const BranchDao = require('../dao/BranchDao');

class RoleService {
    constructor() {
        this.roleDao = new RoleDao();
        
    }

    

    
   
}

module.exports = RoleService;
