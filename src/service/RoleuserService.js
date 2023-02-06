const httpStatus = require('http-status');
const RoleuserDao = require('../dao/RoleuserDao');
const BranchDao = require('../dao/BranchDao');
const ModuleDao = require('../dao/ModuleDao');

const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class RoleuserService {
    constructor() {
        this.roleuserDao = new RoleuserDao();

        this.branchDao = new BranchDao();
        this.moduleDao = new ModuleDao();

    }



    async hasAccessToBranchandBusiness({ roleuser_id, branch_id, business_id }) {


      const roleuser =  await this.roleuserDao.findByWhere({where:{id:roleuser_id},order:['id','ASC'],include:[{model:this.branchDao.Model}, {model:this.moduleDao.Model}]})

        console.log(roleuser);
        return roleuser;
    }
 
   
}

module.exports = RoleuserService;
