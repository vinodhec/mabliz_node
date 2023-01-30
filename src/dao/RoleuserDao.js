const SuperDao = require('./SuperDao');
const models = require('../models');

const Roleuser = models.roleuser;

class RoleuserDao extends SuperDao {
    constructor() {
        super(Roleuser);
    }


   
}

module.exports = RoleuserDao;
