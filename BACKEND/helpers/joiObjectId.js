import Joi from "joi";

const OBJECTID_LENGTH = Number(process.env.OBJECTID_LENGTH) || 24;

/**
 * 
 * @returns joi schema to validate mongo's ObjectId, not required()
 */
export function joiObjectId(){
  return Joi.string().length(OBJECTID_LENGTH).hex().required();
}; 
export function joiObjectIdNotRequired(){
  return Joi.string().length(OBJECTID_LENGTH).hex();
}
/**
 * 
 * @param {number} min - min array length (optional) 
 * @param {number} max - max array length (optional)
 * @returns joi array schema which items are objectIds, not required()
 */
export function joiObjectIdArray(min, max){
  let schema = Joi.array().items(
    Joi.string().length(OBJECTID_LENGTH).hex()
  );

  if (min !== undefined) schema = schema.min(min);
  if (max !== undefined) schema = schema.max(max);

  return schema;
}
