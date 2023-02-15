const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const KitchenbranchcategoriesDao = require('../dao/KitchenbranchcategoriesDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class KitchenbranchcategoriesService {
    constructor() {
        this.kitchenbranchcategoriesDao = new KitchenbranchcategoriesDao();
    }


    
   
}

module.exports = KitchenbranchcategoriesService;
