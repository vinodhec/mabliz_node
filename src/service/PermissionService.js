const httpStatus = require('http-status');
const PermissionDao = require('../dao/PermissionDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class PermissionService {
    constructor() {
        this.permissionDao = new PermissionDao();
    }


    
   
}

module.exports = PermissionService;
