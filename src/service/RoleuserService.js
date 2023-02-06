const httpStatus = require('http-status');
const RoleuserDao = require('../dao/RoleuserDao');
const BranchDao = require('../dao/BranchDao');
const ModuleDao = require('../dao/ModuleDao');

const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');
const { el } = require('date-fns/locale');

class RoleuserService {
    constructor() {
        this.roleuserDao = new RoleuserDao();

        this.branchDao = new BranchDao();
        this.moduleDao = new ModuleDao();

    }



    async hasAccessToBranchandBusiness({ isOwner, roleuser_id, id, branch_id, business_id }) {
        console.log({ isOwner, roleuser_id, id, branch_id, business_id })
        let branches = [];
        if (isOwner) {
            branches = await this.branchDao.findByWhere({ where: { owner_id: id,id:branch_id },  raw: true  });
            console.log(branches.length)
        }

        else {
            const roleuser = await this.roleuserDao.findOneByWhere({ where: { id: roleuser_id }, order: ['id', 'ASC'], attributes: { raw: true }, include: [{ model: this.branchDao.Model, where: { id: branch_id } }, { model: this.moduleDao.Model }] })
            branches = roleuser.branches;
        }

        if (branches.length == branch_id.length) {
            console.log('branch id does not match')
            return false
        }
        else {
            if (business_id && !(branches.some(({ businessId }) => businessId === business_id))) {
                console.log(roleuser.branches.map((dd) => dd.businessId))
                console.log('business id doesnt not match')
                return false
            }
        }

        return true;

    }


}

module.exports = RoleuserService;
