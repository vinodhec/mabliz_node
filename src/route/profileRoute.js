const express = require('express');
const multer = require('multer')

const ProfileController = require('../controllers/ProfileController');
const AdminController = require('../controllers/AdminController');

const router = express.Router();
const auth = require('../middlewares/auth');





router.use(auth());

const profileController = new ProfileController();
const adminController = new AdminController();

router.get('/dashboard-details', profileController.getDashboardDetails);
// router.get('/user/role',profileController.getRoles);

router.get('/user/role', profileController.getRoles);
router.post('/user/role', profileController.addNewRoles);
router.put('/user/role', profileController.updateRole);
router.delete('/user/role', profileController.deleteRole);


router.post('/upload-items',profileController.uploadItems)
router.put('/update-items',profileController.updateItems)
router.delete('/delete-item',profileController.deleteItem)
router.delete('/delete-item-variants',profileController.deleteItemVariants)
router.get('/get-all-items',profileController.getAllItems)
router.get('/get-roles-eligible-for-reporting',profileController.getRolesEligibleForReporting)

router.get('/user/get-modules-for-role', profileController.getModulesForRole);
router.get('/user/get-reporting-users', profileController.getReportingUsers);

router.get('/user/get-all-users-role', profileController.getUsersForRole);

router.get('/user/get-pending-list-for-approval', profileController.getPendingListForApproval);
router.put('/user/approve', profileController.approveRejectApprovalRequest);
router.put('/user/disable-user', profileController.disableUser);
router.delete('/user/delete-user', profileController.deleteUser);

router.post('/user', profileController.addUser1);
router.post('/add-attendance', profileController.addAddentance);

router.post('/findUser', profileController.findUser);
router.post('/getUser', profileController.getUser);
router.get('/get-businesstype-business-branch', profileController.getBusinesstypeBusinessBranch);
router.all('/reviewreason', adminController.crudOperations);

router.get('/businessTypes', profileController.getBusinessTypes)

router.all('/get-business',profileController.getBusiness)
router.all('/get-branch',profileController.getBranch)


router.all('/user/:target', profileController.curdUserAssociated);
router.all('/user/:target1/:target1Id', profileController.curdUserAssociatedTwoTargets);

router.all('/user/:target1/:target1Id/:target2', profileController.curdUserAssociatedTwoTargets);

router.all('/user/:target1/:target1Id/:target2/:target2Id', profileController.curdUserAssociatedTwoTargets);


// router.all('/:target', profileController.curdUserAssociated);
// router.all('/:target1/:target1Id', profileController.curdUserAssociatedTwoTargets);

// router.all('/:target1/:target1Id/:target2', profileController.curdUserAssociatedTwoTargets);
router.all('/businesstype', profileController.curdUserAssociatedTwoTargets);

router.all('/businesstype/:sourceId/:target1/:target1Id/:target2/', profileController.curdUserAssociatedTwoTargets);
router.all('/businesstype/:sourceId', profileController.curdUserAssociatedTwoTargets);
router.all('/businesstype/:sourceId/:target1', profileController.curdUserAssociatedTwoTargets);
router.all('/businesstype/:sourceId/:target1/:target1Id', profileController.curdUserAssociatedTwoTargets);

router.all('/businesstype/:sourceId/:target1/:target1Id/:target2/:target2Id', profileController.curdUserAssociatedTwoTargets);

router.post('/update-for-activation', profileController.updateDetailsForActivation);
const __basedir = 'items'
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         console.log(req)
//       cb(null, __basedir + '/uploads/')
//     },
//     filename: (req, file, cb) => {
//       cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
//     },
//   })
//   const uploadFile = multer({ storage: storage })




module.exports = router;
