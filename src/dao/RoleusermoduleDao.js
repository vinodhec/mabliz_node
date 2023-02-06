const SuperDao = require('./SuperDao');
const models = require('../models');

const Roleusermodule = models.roleusermodule;

class RoleusermoduleDao extends SuperDao {
    constructor() {
        super(Roleusermodule);
    }


   
}

module.exports = RoleusermoduleDao;
