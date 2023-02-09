const SuperDao = require('./SuperDao');
const models = require('../models');

const Rolebranch = models.rolebranch;

class RolebranchDao extends SuperDao {
    constructor() {
        super(Rolebranch);
    }


   
}

module.exports = RolebranchDao;
