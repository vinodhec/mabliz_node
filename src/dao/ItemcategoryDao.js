const SuperDao = require('./SuperDao');
const models = require('../models');

const Itemcategory = models.itemcategory;

class ItemcategoryDao extends SuperDao {
    constructor() {
        super(Itemcategory);
    }


   
}

module.exports = ItemcategoryDao;
