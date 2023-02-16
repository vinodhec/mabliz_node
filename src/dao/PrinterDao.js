const SuperDao = require('./SuperDao');
const models = require('../models');

const Printer = models.printer;

class PrinterDao extends SuperDao {
    constructor() {
        super(Printer);
    }


   
}

module.exports = PrinterDao;
