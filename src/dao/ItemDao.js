const SuperDao = require('./SuperDao');
const models = require('../models');

const Item = models.item;

class ItemDao extends SuperDao {
    constructor() {
        super(Item);
    }


   
}

module.exports = ItemDao;
