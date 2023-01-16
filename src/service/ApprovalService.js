const httpStatus = require('http-status');
const ApprovalDao = require('../dao/ApprovalDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class ApprovalService {
    constructor() {
        this.approvalDao = new ApprovalDao();
    }


    
   
}

module.exports = ApprovalService;
