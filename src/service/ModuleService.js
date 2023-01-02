const httpStatus = require('http-status');
const ModuleDao = require('../dao/ModuleDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class ModuleService {
    constructor() {
        this.moduleDao = new ModuleDao();
    }


    
   
}

module.exports = ModuleService;
