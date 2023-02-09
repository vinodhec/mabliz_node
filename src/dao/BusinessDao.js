const SuperDao = require('./SuperDao');
const models = require('../models');

const Business = models.business;

class BusinessDao extends SuperDao {


    constructor() {


        super(Business);
    }

    

    updateWhereBasedOnUser(user) {
        let where;
        if (user.roleuser_id === 0) {
            where = { owner_id: user.owner_id }
        }
        else {
            where = { id: user.business_id }
        }
        return where;
    }
}

module.exports = BusinessDao;
