const httpStatus = require('http-status');
const RoleuserDao = require('../dao/RoleuserDao');
const BranchDao = require('../dao/BranchDao');
const ModuleDao = require('../dao/ModuleDao');
const RolepermissionDao = require('../dao/RolepermissionDao');
const RoleDao = require('../dao/RoleDao');

const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');
const { el } = require('date-fns/locale');

class RoleuserService {
    constructor() {
        this.roleuserDao = new RoleuserDao();

        this.branchDao = new BranchDao();
        this.moduleDao = new ModuleDao();
        this.roleDao = new RoleDao();
        this.rolepermissionDao = new RolepermissionDao();

    }



    async hasAccessToBranchandBusiness({ isOwner, roleuser_id, id, branch_id, business_id }) {
        console.log({ isOwner, roleuser_id, id, branch_id, business_id })
        let branches = [];
        if (isOwner) {
            branches = await this.branchDao.findByWhere({ where: { owner_id: id,id:branch_id },  raw: true  });
            console.log(branches.length,branch_id.length)
        }

        else {
            const roleuser = await this.roleuserDao.findOneByWhere({ where: { id: roleuser_id }, order: ['id', 'ASC'], attributes: { raw: true }, include: [{ model: this.branchDao.Model, where: { id: branch_id } }, { model: this.moduleDao.Model }] })
            branches = roleuser.branches;
        }

        if (branches.length !== branch_id.length) {
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
    async hasPermissionAccess(roleuser_id,user,modulepermission) {
       
        const {role_id} = await this.roleuserDao.findById(11,{raw:true});

const role = await this.rolepermissionDao.findByWhere({where:{modulepermission}})
       console.log({role,role_id}) 
    //     else {
    //         const roleuser = await this.roleuserDao.findOneByWhere({ where: { id: roleuser_id }, order: ['id', 'ASC'], attributes: { raw: true }, include: [{ model: this.branchDao.Model, where: { id: branch_id } }, { model: this.moduleDao.Model }] })
    //         branches = roleuser.branches;
    //     }

    //     if (branches.length !== branch_id.length) {
    //         console.log('branch id does not match')
    //         return false
    //     }
    //     else {
    //         if (business_id && !(branches.some(({ businessId }) => businessId === business_id))) {
    //             console.log(roleuser.branches.map((dd) => dd.businessId))
    //             console.log('business id doesnt not match')
    //             return false
    //         }
    //     }

    //     return true;

    // }
    }

    async getPermissionDetails(roleuser_id,user,modulepermission){
        const {module,permission:permission_name} = modulepermission
        const role_id = 27;
        const role = await this.rolepermissionDao.findOneByWhere({where:{role_id,module,permission_name},raw:true,order:['role_id','DESC']})
return role
    }

}

module.exports = RoleuserService;
