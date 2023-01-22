const httpStatus = require('http-status');
const ItemvariantDao = require('../dao/ItemvariantDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class ItemvariantService {
    constructor() {
        this.itemvariantDao = new ItemvariantDao();
    }


    
   
}

module.exports = ItemvariantService;
