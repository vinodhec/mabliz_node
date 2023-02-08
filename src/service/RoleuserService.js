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



    async hasAccessToBranchandBusiness({ is_owner, roleuser_id, id, branch_id, business_id }) {
        let branches = [];
console.log({is_owner,id,roleuser_id,branch_id,business_id})
        if (is_owner) {
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
       
        const {role_id} = await this.roleuserDao.findById(roleuser_id,{raw:true});

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
        if(user.is_owner){
            return { need_approval:0,isOwner:true}
        }
        const {module,permission:permission_name} = modulepermission
        const {role_id} =  await this.roleuserDao.findById(roleuser_id,{raw:true})
        console.log(role_id)
        const role = await this.rolepermissionDao.findOneByWhere({where:{role_id,module,permission_name},raw:true,order:['role_id','DESC']})
return role
    }

}

module.exports = RoleuserService;
