const SuperDao = require('./SuperDao');
const models = require('../models');

const Kitchenbranchcategories = models.kitchenbranchcategory;

class KitchenbranchcategoriesDao extends SuperDao {
    constructor() {
        super(Kitchenbranchcategories);
    }


   
}

module.exports = KitchenbranchcategoriesDao;
