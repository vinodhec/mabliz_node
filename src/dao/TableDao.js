const SuperDao = require('./SuperDao');
const models = require('../models');

const Table = models.table;

class TableDao extends SuperDao {
    constructor() {
        super(Table);
    }


   
}

module.exports = TableDao;
