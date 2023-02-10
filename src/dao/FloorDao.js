const SuperDao = require('./SuperDao');
const models = require('../models');

const Floor = models.floor;

class FloorDao extends SuperDao {
    constructor() {
        super(Floor);
    }


   
}

module.exports = FloorDao;
