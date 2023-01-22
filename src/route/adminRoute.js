const express = require('express');
const AdminController = require('../controllers/AdminController');
const ProfileController = require('../controllers/ProfileController');


const router = express.Router();

const adminController = new AdminController();
const profileController = new ProfileController();
const auth = require('../middlewares/auth');
router.use(auth(true));




router.get('/get-pending-activation-group', adminController.getActivationGroup);
router.all('/addon',adminController.crudOperations)
router.all('/tax',adminController.crudOperations)
router.all('/permission',adminController.crudOperations)
// router.all('/module',adminController.crudOperations)

router.all('/module', profileController.curdUserAssociatedTwoTargets);

router.all('/module/:sourceId/:target1/:target1Id/:target2/', profileController.curdUserAssociatedTwoTargets);
router.all('/module/:sourceId',  profileController.curdUserAssociatedTwoTargets);
router.all('/module/:sourceId/:target1', profileController.curdUserAssociatedTwoTargets);
router.all('/module/:sourceId/:target1/:target1Id', profileController.curdUserAssociatedTwoTargets);

router.get('/businessType/:businesstype_id/module',adminController.getModulesForBusinessType)
router.post('/businessType/:businesstype_id/module',adminController.addModulesToBusinessType)
router.delete('/businessType/:businesstype_id/module',adminController.deleteModulesToBusinessType)



router.all('/validity',adminController.crudOperations)
router.get('/plandetails',(req,res,next)=>{
    req.body ={"tax":{},"validity":{}};
    console.log(req.body)
    next();
},adminController.multipleCrudOperations)

router.post('/plans', adminController.addPlan);
router.get('/plans', adminController.getPlansByBusinessId);

router.put('/plans', adminController.updatePlans);
router.delete('/plans', adminController.deletePlans);
router.delete('/planvalidity', adminController.deleteValidity);

router.post('/subscribe-to-plan',adminController.subscribeToPlan)
router.get('/get-subscribed-plans',adminController.getSubscribedPlans)


module.exports = router;
