const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const TableDao = require('../dao/TableDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class TableService {
    constructor() {
        this.tableDao = new TableDao();
    }

    getTableFromFloorandTableId= async({floor_id,table_id})=>{

       const table = await this.tableDao.Model.findAll({floor_id,id:table_id})
    
    return table[0];
    }
    
   
}

module.exports = TableService;
