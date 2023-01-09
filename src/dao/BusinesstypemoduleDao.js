const SuperDao = require('./SuperDao');
const models = require('../models');

const Businesstypemodule = models.businesstypemodule;

class BusinesstypemoduleDao extends SuperDao {
    constructor() {
        super(Businesstypemodule);
    }


   
}

module.exports = BusinesstypemoduleDao;
