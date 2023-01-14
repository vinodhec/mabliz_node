const httpStatus = require('http-status');
const RolepermissionDao = require('../dao/RolepermissionDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class RolepermissionService {
    constructor() {
        this.rolepermissionDao = new RolepermissionDao();
    }


    
   
}

module.exports = RolepermissionService;
