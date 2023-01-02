const SuperDao = require('./SuperDao');
const models = require('../models');

const Permission = models.permission;

class PermissionDao extends SuperDao {
    constructor() {
        super(Permission);
    }


   
}

module.exports = PermissionDao;
