const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const FloorDao = require('../dao/FloorDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class FloorService {
    constructor() {
        this.floorDao = new FloorDao();
    }


getFloorFromFloorandBranchId=async({floor_id,branch_id})=>{

const floor   =  await this.floorDao.findOneByWhere({where:{ id: floor_id, ...(branch_id && {branch_id}) }})
console.log(floor);
return floor
}
    
   
}

module.exports = FloorService;
