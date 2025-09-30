import Joi from "joi";

export const userValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: true } })
    .required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  dateOfBirth: Joi.date()
    .less("now")
    .required()
    .custom((value, helpers) => {
      const today = new Date();
      let age = today.getFullYear() - value.getFullYear();
      const mth = today.getMonth() - value.getMonth();
      if (mth < 0 || (mth === 0 && today.getDate() < value.getDate()))
        //compleanno da fare
        age--;
      if (age < 18) return helpers.error("any.invalid");
      return value;
    }, "Age validation"),
  username: Joi.string()
    .min(3)
    .required()
    .pattern(/(?![_.])[A-Za-z0-9._]+(?<![_.])/),
  bio: Joi.string().trim().max(300),
  
});
