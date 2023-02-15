const SuperDao = require('./SuperDao');
const models = require('../models');

const Kitchen = models.kitchen;

class KitchenDao extends SuperDao {
    constructor() {
        super(Kitchen);
    }


   
}

module.exports = KitchenDao;
