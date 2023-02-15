const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const KitchenDao = require('../dao/KitchenDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class KitchenService {
    constructor() {
        this.kitchenDao = new KitchenDao();
    }


    
   
}

module.exports = KitchenService;
