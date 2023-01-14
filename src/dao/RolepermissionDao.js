const SuperDao = require('./SuperDao');
const models = require('../models');

const Rolepermission = models.rolepermission;

class RolepermissionDao extends SuperDao {
    constructor() {
        super(Rolepermission);
    }


   
}

module.exports = RolepermissionDao;
