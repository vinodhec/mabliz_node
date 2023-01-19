const SuperDao = require('./SuperDao');
const models = require('../models');

const Attendance = models.attendance;

class AttendanceDao extends SuperDao {
    constructor() {
        super(Attendance);
    }


   
}

module.exports = AttendanceDao;
