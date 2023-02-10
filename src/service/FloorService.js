const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const FloorDao = require('../dao/FloorDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class FloorService {
    constructor() {
        this.floorDao = new FloorDao();
    }


    
   
}

module.exports = FloorService;
