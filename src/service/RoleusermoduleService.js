const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const RoleusermoduleDao = require('../dao/RoleusermoduleDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class RoleusermoduleService {
    constructor() {
        this.roleusermoduleDao = new RoleusermoduleDao();
    }


    
   
}

module.exports = RoleusermoduleService;
