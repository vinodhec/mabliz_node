const SuperDao = require('./SuperDao');
const models = require('../models');

const Business = models.business;

class BusinessDao extends SuperDao {


    constructor() {


        super(Business);
    }

    getAllBusiness(user, { where = {}, limit, offset, order } = {}) {
        const updatedWhere = this.updateWhereBasedOnUser(user);
        console.log('asd', { ...updatedWhere, ...where })
        return super.getDataTableData({ ...updatedWhere, ...where }, limit, offset, order);
    }

    updateWhereBasedOnUser(user) {
        let where;
        if (user.role_id === 0) {
            where = { owner_id: user.id }
        }
        else {
            where = { id: user.business_id }
        }
        return where;
    }
}

module.exports = BusinessDao;
