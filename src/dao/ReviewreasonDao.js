const SuperDao = require('./SuperDao');
const models = require('../models');

const Reviewreason = models.reviewreason;

class ReviewreasonDao extends SuperDao {
    constructor() {
        super(Reviewreason);
    }


   
}

module.exports = ReviewreasonDao;
