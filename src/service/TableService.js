const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const TableDao = require('../dao/TableDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class TableService {
    constructor() {
        this.tableDao = new TableDao();
    }


    
   
}

module.exports = TableService;
