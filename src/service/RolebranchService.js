const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const RolebranchDao = require('../dao/RolebranchDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class RolebranchService {
    constructor() {
        this.rolebranchDao = new RolebranchDao();
    }


    
   
}

module.exports = RolebranchService;
