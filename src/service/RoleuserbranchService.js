const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const RoleuserbranchDao = require('../dao/RoleuserbranchDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');
const BranchDao = require('../dao/BranchDao');
const e = require('cors');

class RoleuserbranchService {
    constructor() {
        this.roleuserbranchDao = new RoleuserbranchDao();
        this.branchDao = new BranchDao();
    }


    getBranches =async(user)=>{
        let      branch_id 
console.log(user.roleuser_id)
if(user.roleuser_id === 0){
branch_id = await this.branchDao.findByWhere({where:{owner_id:user.id},raw:true, attributes:['id']})
}
else{
    branch_id =await this.roleuserbranchDao.findByWhere({where:{roleuser_id:user.roleuser_id},raw:true, attributes:['branch_id']})

}
     return branch_id.map(({branch_id,id})=>branch_id??id)
    }

}

module.exports = RoleuserbranchService;
