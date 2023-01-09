const express = require('express');
const OptionController = require('../controllers/OptionController');

const router = express.Router();

const optionController = new OptionController();
const auth = require('../middlewares/auth');


router.get('/get-fields', optionController.getFields);

router.get('/get-fields-auth',auth(), optionController.getFields);



module.exports = router;
