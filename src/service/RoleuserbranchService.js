const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const RoleuserbranchDao = require('../dao/RoleuserbranchDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');
const BranchDao = require('../dao/BranchDao');

class RoleuserbranchService {
    constructor() {
        this.roleuserbranchDao = new RoleuserbranchDao();
        this.branchDao = new BranchDao();
    }


    getBranches =async(user)=>{

        const branch_id =await this.roleuserbranchDao.findByWhere({where:{roleuser_id:user.roleuser_id},raw:true, attributes:['branch_id']})
     return branch_id.map(({branch_id})=>branch_id)
    }

}

module.exports = RoleuserbranchService;
