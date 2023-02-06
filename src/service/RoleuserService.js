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


        const roleuser = await this.roleuserDao.findOneByWhere({ where: { id: roleuser_id }, order: ['id', 'ASC'], attributes: { raw: true }, include: [{ model: this.branchDao.Model, where: { id: branch_id } }, { model: this.moduleDao.Model }] })
        if (roleuser.branches.length !== branch_id.length) {
            console.log('branch id does not match')
            return false
        }
        else {
            if (roleuser.branches.some(({businessId}) => businessId === business_id)) {
                console.log(roleuser.branches.map((dd)=>dd.businessId))
              console.log('business id doesnt not match')
                return false
            }
        }

        return true;

    }


}

module.exports = RoleuserService;
