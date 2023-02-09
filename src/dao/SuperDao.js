const logger = require('../config/logger');

class SuperDao {
    constructor(model) {
        this.Model = model;
    }

    async findAll() {
        return this.Model.findAll()
            .then((result) => {
                return result;
            })
            .catch((e) => {
                logger.error(e);
                console.log(e);
            });
    }

    async findAll(attributes) {
        return this.Model.findAll(attributes)
            .then((result) => {
                return result;
            })
            .catch((e) => {
                logger.error(e);
                console.log(e);
            });
    }

    async findById(id,options={}) {
        console.log({...options})
        return this.Model.findOne({ where: { id },...options })
            .then((result) => {
                return result;
            })
            .catch((e) => {
                logger.error(e);
                console.log(e);
            });
    }

    async findOneByWhere(  {        order ,...others
    }={ },) {
            if(!order){
                order =['id','DESC']
            }
    
        return this.Model.findOne({                order: [order],...others}
            )
            .then((result) => {
                return result;
            })
            .catch((e) => {
                logger.error(e);
                console.log(e);
            });
    }

    async updateWhere(data, where) {
        return this.Model.update(data, { where })
            .then((result) => {
                return result;
            })
            .catch((e) => {
                logger.error(e);
                console.log(e);
            });
    }

    async updateById(data, id) {
        return this.Model.update(data, { where: { id } })
            .then((result) => {
                return result;
            })
            .catch((e) => {
                logger.error(e);
                console.log(e);
            });
    }

    async create(data) {
        try {
            console.log(this.Model)
            const newData = new this.Model(data);
            return newData
                .save()
                .then((result) => {
                    return result;
                })
                .catch((e) => {
                    logger.error(e);
                    console.log(e);
                });
        } catch (e) {
            console.log(e);
        }
    }

    async findByWhere(
        {
        order ,...others
         }={ },
    ) {
        let query  = others
            
        if(order){
        query = {...others,order:[order]}
        }
            return this.Model.findAll(query);

      
    }

    async deleteByWhere(where) {
        return this.Model.destroy({ where });
    }

    async bulkCreate(data) {
        return this.Model.bulkCreate(data)
            .then((result) => {
                return result;
            })
            .catch((e) => {
                logger.error(e);
                console.log(e.message);
            });
    }

    async getCountByWhere(where) {
        return this.Model.count({ where })
            .then((result) => {
                return result;
            })
            .catch((e) => {
                logger.error(e);
                console.log(e);
            });
    }

    async incrementCountInFieldByWhere(fieldName, where, incrementValue = 1) {
        const instance = await this.Model.findOne({ where });
        if (!instance) {
            return false;
        }
        // eslint-disable-next-line no-return-await
        return await instance.increment(fieldName, { by: incrementValue });
    }

    async decrementCountInFieldByWhere(fieldName, where, decrementValue = 1) {
        const instance = await this.Model.findOne({ where });
        if (!instance) {
            return false;
        }
        // eslint-disable-next-line no-return-await
        return await instance.decrement(fieldName, { by: decrementValue });
    }

    async updateOrCreate(values, condition) {
        return this.Model.findOne({ where: condition }).then((obj) => {
            // update
            if (obj) {
                return obj.update(values);
            }
            // insert
            return this.Model.create(values);
        });
    }

    async checkExist(condition) {
        return this.Model.count({ where: condition }).then((count) => {
            if (count !== 0) {
                return true;
            }
            return false;
        });
    }

    updateWhereBasedOnUser(){

        return {}
    }

    getAll( {user, where, ...others } = {}) {
        const updatedWhere = this.updateWhereBasedOnUser(user);
        console.log('asd', { ...updatedWhere, ...where })
        return this.getDataTableData({where:{ ...updatedWhere, ...where },...others});
    }

// create(user,)

    async getDataTableData({limit,offset,...others}) {
        console.log(others);
        return this.Model.findAndCountAll({
            limit: parseInt(limit??10 , 10),
            offset: parseInt(offset??0, 10),
            ... others
        })
            .then((result) => {
                return result;
            })
            .catch((e) => {
                logger.error(e);
                console.log(e);
                return [];
            });
    }
}
module.exports = SuperDao;
