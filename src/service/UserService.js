const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const UserDao = require('../dao/UserDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');
const { userConstant } = require('../config/constant');

const {omit} = require('lodash');

class UserService {
    constructor() {
        this.userDao = new UserDao();
    }

    /**
     * Create a user
     * @param {Object} userBody
     * @returns {Object}
     */
    createUser = async (tempUserBody) => {
        const userBody = omit(tempUserBody, ['isAdmin','status','is_owner','role']);

        try {
            let message = 'Business registration successful,pending for activation. We will get back on 48 hours';
            if (await this.userDao.isAlreadyExists(userBody.email,'email')) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Email already registered');
            }
            if (await this.userDao.isAlreadyExists(userBody.phone_number,'phone_number')) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Phone Number already registered');
            }
            const uuid = uuidv4();
            userBody.email = userBody.email.toLowerCase();
            if(userBody.mpin){
                userBody.mpin = bcrypt.hashSync(userBody.mpin, 8);
            }
            userBody.uuid = uuid;
            userBody.is_owner = true;
            userBody.role={id:0,label:'OWNER'}
            let userData = await this.userDao.create({...userBody,status: userConstant.STATUS_ACTIVE});
            userBody.owner_id = userData.id;

            if (!userData) {
                message = 'Registration Failed! Please Try again.';
                return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
            }
          
            if(userBody.mode.includes('PARTNER')){
                const businessData = await userData.createBusiness({'inital_request_details':userBody, ...userBody});
             
      
           
                
            }
            userData = userData.toJSON();
            delete userData.password;
            return responseHandler.returnSuccess(httpStatus.CREATED,userBody.mode.includes('PARTNER') ? message: 'User is successfully created', userData);

         
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
        }
    };






    /**
     * Get user
     * @param {String} email
     * @returns {Object}
     */

    isEmailExists = async (email) => {
        const message = 'Email found!';
        if (!(await this.userDao.isEmailExists(email))) {
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Email not Found!!');
        }
        return responseHandler.returnSuccess(httpStatus.OK, message);
    };

    getUserByUuid = async (uuid) => {
        return this.userDao.findOneByWhere({ uuid });
    };

    isUserAllowedToAccess = async(user,path)=>{
        const {role_id} = user;
        if(role_id === 0){
            return true;
        }
        else{
            return false;
        }
        return true;

    }
    changePassword = async (data, uuid) => {
        let message = 'Login Successful';
        let statusCode = httpStatus.OK;
        let user = await this.userDao.findOneByWhere({ uuid });

        if (!user) {
            return responseHandler.returnError(httpStatus.NOT_FOUND, 'User Not found!');
        }

        if (data.password !== data.confirm_password) {
            return responseHandler.returnError(
                httpStatus.BAD_REQUEST,
                'Confirm password not matched',
            );
        }

        const isPasswordValid = await bcrypt.compare(data.old_password, user.password);
        user = user.toJSON();
        delete user.password;
        if (!isPasswordValid) {
            statusCode = httpStatus.BAD_REQUEST;
            message = 'Wrong old Password!';
            return responseHandler.returnError(statusCode, message);
        }
        const updateUser = await this.userDao.updateWhere(
            { password: bcrypt.hashSync(data.password, 8) },
            { uuid },
        );

        if (updateUser) {
            return responseHandler.returnSuccess(
                httpStatus.OK,
                'Password updated Successfully!',
                {},
            );
        }

        return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Password Update Failed!');
    };
}

module.exports = UserService;
