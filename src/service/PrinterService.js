const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const PrinterDao = require('../dao/PrinterDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class PrinterService {
    constructor() {
        this.printerDao = new PrinterDao();
    }


    
   
}

module.exports = PrinterService;
