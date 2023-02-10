const httpStatus = require("http-status");
const BusinessTypeService = require("../service/BusinesstypeService");
const ModuleService = require("../service/ModuleService");

const BusinesscategoryService = require("../service/BusinesscategoryService");
const BusinessactivityService = require("../service/BusinessactivitiyService");
const BusinessService = require("../service/BusinessService");
const BranchService = require("../service/BranchService");
const AdminController = require('./AdminController');
const ProfileController = require('./ProfileController');


const adminController = new AdminController();
const profileController = new ProfileController();
const responseHandler = require("../helper/responseHandler");
const { omit } = require("lodash");
class OptionController {

  updateJson = ({ jsonFile, tabIndex, groupIndex, fieldIndex, value }) => {
    jsonFile[tabIndex].details[groupIndex].fields[fieldIndex].fields =
      value.map((dd) => {
        return {
          ...jsonFile[tabIndex].details[groupIndex].fields[fieldIndex]
            .fields[0],
          ...dd,
        };
      });

    return jsonFile;
  }


  someFn = () => Promise.resolve('fake data')


  getFields = async (req, res) => {
    const { type, businesstypeId } = req.query;
    if (!type) {
      res.json(
        responseHandler.returnError(httpStatus.OK, "type param is mandatory")
      );
    }
    try {
      const jsonFile = require(`../json/${type}.json`).slice();
      console.log({jsonFile})
      const businessType =
        await new BusinessTypeService().businessTypeDao.findAll({
          raw: true,
        });

      const businessCategory =
        await new BusinesscategoryService().businesscategoryDao.findAll({
          raw: true,
        });



      const promises = jsonFile.map((tab, tabIndex) => {
        return tab.details.map(async (group, groupIndex) => {
          const promises = group.fields.map(async (field, fieldIndex) => {
            if (field.requestKey === "business_type") {
              this.updateJson({ jsonFile, tabIndex, groupIndex, fieldIndex, value: businessType })
            }
            else if (field.requestKey === "business_category") {
              this.updateJson({ jsonFile, tabIndex, groupIndex, fieldIndex, value: businessCategory })
            }
            else if (field.requestKey === "business_activities") {
              const pp = new BusinessactivityService().businessactivitiyDao.findAll({
                raw: true,
              }).then((businessActivity) => {
                this.updateJson({ jsonFile, tabIndex, groupIndex, fieldIndex, value: businessActivity })

              });
              return await pp;
            }
            else if (field.requestKey === "business_id") {

              const pp = req.user.getBusinesses({ raw: true }).then((business) => {
                this.updateJson({ jsonFile, tabIndex, groupIndex, fieldIndex, value: business })

              });
              return await pp;
            }

            else if (field.requestKey === "branch_id") {

              const pp = req.user.getBusinesses({ include: new BranchService().branchDao.Model }).then((business) => {
                this.updateJson({ jsonFile, tabIndex, groupIndex, fieldIndex, value: business?.map(({ branches }) => branches?.[0]?.dataValues) })

              });
              return await pp;
            }

            else if (field.requestKey === 'permissions') {

              const pp = adminController.utilgetModulesForBusinessType(businesstypeId).then((modules) => {
console.log({modules})
                this.updateJson({ jsonFile, tabIndex, groupIndex, fieldIndex, value: modules.map(({ dataValues }) => dataValues) })

              });
              return await pp;


            }
            else if(field.requestKey === 'reporting_role'){


              const pp = profileController.getRolesForUser(req.user, businesstypeId, 'yes').then(({rows}) => {
                console.log(rows);

                this.updateJson({ jsonFile, tabIndex, groupIndex, fieldIndex, value: [{label:'OWNER',id:0},...rows.map(({ dataValues }) => ({label:dataValues.name,id:dataValues.id }))]})

              });
              return await pp;
            }
            else {
              return await this.someFn

            }

          });

          return await Promise.all(promises);
        });
      });
      await Promise.all(promises.flat(1));
      if (type === 'role') {
        console.log(req.user)
        const businesses =  await new BusinessService().businessDao.getAll({user:req.user,include:{model:new BranchService().branchDao.Model, attributes:['id','branch_name','businessId']}})
        console.log({businesses})
        businesses.rows.forEach((business) => {
         console.log(business)
          jsonFile[0].details[2] =({ title: business.dataValues?.business_name,
          
            "eligility": ["PARTNER"],
    
            "fields": [
              {
                "type": "grid",
                "subType": "chip",
                "isMandatory": true,
                "eligility": ["PARTNER"],
                "requestKey": "branch_ids",
                "fields":  business.dataValues?.branches.map(({dataValues:branch})=>({...branch, label:branch.branch_name}))
              }
            ]
          })

        })
console.log(jsonFile[0].details[2])

      }

      res.json(
        responseHandler.returnSuccess(httpStatus.OK, "Success", jsonFile)
      );
    } catch (e) {
      console.log(e);
      if (e.code === "MODULE_NOT_FOUND") {
        res.json(
          responseHandler.returnError(httpStatus.OK, "Invalid type param")
        );
      }
      res.json(responseHandler.returnError(httpStatus.OK, "Error"));
    }
  }
}

module.exports = OptionController;
