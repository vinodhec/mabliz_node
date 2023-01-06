const httpStatus = require('http-status');
const BusinesstypemoduleDao = require('../dao/BusinesstypemoduleDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class BusinesstypemoduleService {
    constructor() {
        this.businesstypemoduleDao = new BusinesstypemoduleDao();
    }


    
   
}

module.exports = BusinesstypemoduleService;
