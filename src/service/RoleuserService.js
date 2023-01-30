const httpStatus = require('http-status');
const RoleuserDao = require('../dao/RoleuserDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class RoleuserService {
    constructor() {
        this.roleuserDao = new RoleuserDao();
    }


    
   
}

module.exports = RoleuserService;
