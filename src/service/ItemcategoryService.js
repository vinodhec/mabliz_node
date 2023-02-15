const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const ItemcategoryDao = require('../dao/ItemcategoryDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class ItemcategoryService {
    constructor() {
        this.itemcategoryDao = new ItemcategoryDao();
    }


    
   
}

module.exports = ItemcategoryService;
