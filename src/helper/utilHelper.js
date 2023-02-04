const capitalize = require("capitalize");
const pluralize = require("pluralize");
const responseHandler = require("../helper/responseHandler");
const httpStatus = require("http-status");
const { omit } = require("lodash");


const abs_path =  "https://mabliz-dev.onrender.com/"

const getAbsolutePath = (path) => {
  return abs_path + path;
};



const removeAbsolutePath = (path) => {
  return  path.replaceAll(abs_path,"");
};

const getRecord = async ({ id, sourceModel, getMixin, res }) => {
  if (!id) {
    res.send(
      responseHandler.returnError(httpStatus.BAD_REQUEST, "Id is mandatory")
    );
    return;
  }

  const record = await sourceModel[getMixin]({
    where: {
      id,
    },
  });

  if (record.length === 0) {
    res.send(
      responseHandler.returnError(
        httpStatus.BAD_REQUEST,
        "Id: " + id + " Not found"
      )
    );
    return;
  }

  return record;
};

const crudOperations = async ({ req, res, source, target, id }) => {
  const targetModelName = capitalize(target);

  const targetModelName_plural = pluralize(targetModelName);

  const sourceModelName = source || "user";
  const sourceModel = req[sourceModelName];
  const getMixin = "get" + targetModelName_plural;
   console.log("body",req.body)
  switch (req.method) {
    case "GET":
      const modelListData = await sourceModel[getMixin]();
      res.json(
        responseHandler.returnSuccess(httpStatus.OK, "Success", modelListData)
      );
      break;
    case "POST":
      const createMixin = "create" + targetModelName;
console.log(req.body)
      const modelAddedData = await sourceModel[createMixin]({...req.body,inital_request_details:req.body});
      res.json(
        responseHandler.returnSuccess(httpStatus.OK, "Success", modelAddedData)
      );
      break;
    case "PUT":
      record = await getRecord({ id, sourceModel, getMixin, res });
      if (record) {
        const modelUpdateData = await record[0].update(req.body);
        res.json(
          responseHandler.returnSuccess(
            httpStatus.OK,
            "Success",
            modelUpdateData
          )
        );
      }

      break;

    case "DELETE":
      record = await getRecord({ id, sourceModel, getMixin, res });
      if (record) {
        await record[0].destroy();
        res.json(responseHandler.returnSuccess(httpStatus.OK, "Success"));
      }
      break;
  }
};

const basicCrudOperations = async (req, res, path) => {
  const modelName = path || req.path.split("/")?.[1];
  const Dao = require("./../dao/" + capitalize(modelName) + "Dao");
  const model = new Dao();
   console.log(req.method)
  let data ={}
  switch (req.method) {
    case "GET":
       data = await model.findAll();
     
      break;
    case "POST":
      data = await model.create(req.body);
      break;
    case "PUT":
     await model.updateWhere(req.body,{id:req.body.id})
    

      break;

    case "DELETE":
    await model.deleteByWhere({id:req.body.id})
 
      
      break;
  }
  if(path){
    console.log({data});

    return data
  }
  else{
    return res.json(responseHandler.returnSuccess(httpStatus.OK, "Success", data));

  }

};

const crudOperationsTwoTargets = async (object) => {
  const {
    req,
    res,
    source,
    target1,
    target2,
    target1Id,
    sourceId,
    target2Id,
    id,
  } = object;
  console.log({ source, sourceId, target1, target2, target1Id, target2Id, id });
  console.log({ source, sourceId, target1, target2, target1Id, target2Id, id })
  const target1ModelName = capitalize(target1 || "");
  const target1ModelName_plural = pluralize(target1ModelName);
  const getMixin1 = "get" + target1ModelName_plural;

  const target2ModelName = capitalize(target2 || "");
  const target2ModelName_plural = pluralize(target2ModelName);
  const getMixin2 = "get" + target2ModelName_plural;

  const sourceModelName = req.path.split("/")[1] || "user";
  let sourceModel = req[sourceModelName];
  const isEmpty = Object.values(omit(object, ["req", "res"])).every(
    (x) => x === undefined || x === ""
  );
  console.log({ isEmpty });
  if (sourceModelName !== "user") {
    const Dao = require("./../dao/" + capitalize(sourceModelName) + "Dao");
    sourceModel = sourceId
      ? await new Dao().Model.findByPk(sourceId)
      : await new Dao().Model;

    console.log({ sourceId, sourceModel });
    // const category = await sourceModel.getBusinesscategories({where:{id:2}});
    // console.log('test',await (category).createBusinessactivities({label:'hello'}))
  }
  let targetid1Query = { where: {} };
  if (target1Id) {
    targetid1Query.where = { id: target1Id };
  }

  let targetid2Query = { where: {} };
  if (target2Id) {
    targetid2Query.where = { id: target2Id };
  }
  let modelListDatatemp;
  switch (req.method) {
    case "GET":
      modelListDatatemp = isEmpty
        ? await sourceModel.findAll()
        : await sourceModel[getMixin1](targetid1Query);
      console.log({ modelListDatatemp });
      let modelListData = target2
        ? await modelListDatatemp?.[0]?.[getMixin2](targetid2Query)
        : modelListDatatemp;
      if (target2Id) {
        modelListData = modelListData?.[0];
      }
      console.log({ modelListData });
      res.json(
        responseHandler.returnSuccess(httpStatus.OK, "Success", modelListData)
      );
      break;
    case "POST":
      let modelAddedData;
      if (target2) {
        modelListDatatemp = await sourceModel[getMixin1](targetid1Query);
     

        modelAddedData = await modelListDatatemp[0][
          "create" + target2ModelName
        ](req.body);
      } else {
        const createMixin = "create" + target1ModelName;

        modelAddedData = await sourceModel[createMixin](req.body);
      }
      res.json(
        responseHandler.returnSuccess(httpStatus.OK, "Success", modelAddedData)
      );
      break;
    case "PUT":
      try {
        let result;
        
        modelListDatatemp = await sourceModel[getMixin1](targetid1Query);
        if (target2) {
          const temp = await modelListDatatemp?.[0]?.[getMixin2](
            targetid2Query
          );
          console.log(temp);
          result = await temp[0].update(req.body);
        } else {
          try{
            result = await modelListDatatemp[0].update(req.body);
          }
          catch(e){

            result = await sourceModel.update(req.body);

          }
        }
        res.json(
          responseHandler.returnSuccess(httpStatus.OK, "Success", result)
        );
      } catch (error) {
        console.error(error);
        res.json(responseHandler.returnError(httpStatus.BAD_REQUEST, "Error"));
      }
      break;

    case "DELETE":
      try {
        modelListDatatemp = await sourceModel[getMixin1](targetid1Query);
        if (target2) {
          const temp = await modelListDatatemp?.[0]?.[getMixin2](
            targetid2Query
          );
          console.log(temp);
          await temp[0].destroy();
        } else {
          await modelListDatatemp[0].destroy();
        }
        res.json(responseHandler.returnSuccess(httpStatus.OK, "Success"));
      } catch (error) {
        console.error(error);
        res.json(responseHandler.returnError(httpStatus.BAD_REQUEST, "Error"));
      }

      break;
  }
};

const itemMappings ={
  'Cuisine':'cuisine',
  'Type':'type',
  'Variety':'variety',
  'Category':'category',
  'Sub Category':'sub_category',
  'Brand':'brand',
  'Item / Product Name':'item_generic_name','Item Name (Local Language)':'name_local_language',
  "Order Type":'order_type',
        "Pre Booking":'pre_booking',
        "Available Time":'available_time',
        "Availability Days":'availability_days',
        "Description":'description',
        "Mandatory (Any One)":'customize',
        "Add-Ons (Multi Selection)":'add_ons',
        "Kitchen Notes":'kitchen_notes',
        "Selling Size":'selling_size',
        "Selling Qty":'selling_qty',
        "Variant Name (Auto Fill)":'name',
        "Variant Nam Local Lang (Auto Fill)":'name_local_language',
        "Variant Description":'variant_description',
        "Dish Code":'dish_code',
        "Search Code":'search_code',
        "Special Notes / Message":'special_notes',
        "Photo":'photo',
        "Selling Price":'selling_price',
        "Dining Price, Service Chg":'dinning_price_virtual',
        "A/C Dining Price, Service Chg":'ac_dinning_price_virtual',
        "Open Dining Price, Service Chg":'open_dinning_price_virtual',
        "Self Service Price, Service Chg":'self_service_price_virtual',
        "Take Away Price, Parcel Chg":'takeaway_price_virtual',
        "Delivery Price, Parcel Chg":'delivery_price_virtual',
        "Dining Discount":'dinning_discount',
        "A/C Dining Discount":"ac_dinning_discount",
        "Take Away Discount":'takeaway_discount',
        "Open Dining Discount":'open_dining_discount',
        "Self Service Discount":'self_service_discount',
        "Delivery Discount":'delivery_discount',
        "Purchase Unit":'purchase_unit',
        "Selling Unit":'selling_unit',
        "Purchase Method":'purchase_method',
        "Selling Method":'selling_method',
        "Purchase Tax":'purchase_tax_unformatted',
        "Sales Tax":'sales_tax_unformatted',
        "Stock Type":'stock_type',
        "Minimum Stock (Intimation)":'min_stock_notification',
        "Mfg. Date":'mfg_date',
        "Exp Date":'exp_date',
        "Batch No":'batch_no',
        "HSN Code":'hsn_code',
        "QR":'qr_code',
        "Barcode":'barcode',
        "Photo":'isPhoto','S.No':'S.No'
}

module.exports = {
  getAbsolutePath,
  crudOperations,
  crudOperationsTwoTargets,
  basicCrudOperations,
  removeAbsolutePath,
  itemMappings
};
