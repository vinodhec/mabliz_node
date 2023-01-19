const httpStatus = require('http-status');
const AttendanceDao = require('../dao/AttendanceDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class AttendanceService {
    constructor() {
        this.attendanceDao = new AttendanceDao();
    }


    
   
}

module.exports = AttendanceService;
