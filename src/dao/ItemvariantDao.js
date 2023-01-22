const SuperDao = require('./SuperDao');
const models = require('../models');

const Itemvariant = models.itemvariant;

class ItemvariantDao extends SuperDao {
    constructor() {
        super(Itemvariant);
    }


   
}

module.exports = ItemvariantDao;
