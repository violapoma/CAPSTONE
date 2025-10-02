/**
 * 
 * @param {*} schema joi schema
 * @param {*} property body, query, params; default: params
 * @returns middleware that checks the given schema 
 * validate returns {value, error}
 * error == undefined -> all good, calls next in chain
 * error != undefined -> error.details from joi validation in one string
 */
export const validate = (schema, property = 'params') => {
  return (request, response, next) => {
    console.log(request.params.userId);
    const { error } = schema.validate(request[property]);
    if (error) {
      const msg = error.details.map(err => err.message).join(', ');
      return response.status(400).json({ message: msg });
    }
    next();
  };
};