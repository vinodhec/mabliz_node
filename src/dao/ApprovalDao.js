const SuperDao = require('./SuperDao');
const models = require('../models');

const Approval = models.approval;

class ApprovalDao extends SuperDao {
    constructor() {
        super(Approval);
    }


   
}

module.exports = ApprovalDao;
