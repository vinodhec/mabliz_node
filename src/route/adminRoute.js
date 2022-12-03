const express = require('express');
const AdminController = require('../controllers/AdminController');

const router = express.Router();

const adminController = new AdminController();


router.get('/get-pending-activation-group', adminController.getActivationGroup);




module.exports = router;
