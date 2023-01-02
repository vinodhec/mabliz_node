const SuperDao = require('./SuperDao');
const models = require('../models');

const Module = models.module;

class ModuleDao extends SuperDao {
    constructor() {
        super(Module);
    }


   
}

module.exports = ModuleDao;
