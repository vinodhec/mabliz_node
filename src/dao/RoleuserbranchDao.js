const SuperDao = require('./SuperDao');
const models = require('../models');

const Roleuserbranch = models.roleuserbranch;

class RoleuserbranchDao extends SuperDao {
    constructor() {
        super(Roleuserbranch);
    }

   
}

module.exports = RoleuserbranchDao;
