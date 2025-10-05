import Joi from "joi";

export const editUserValidator = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  dateOfBirth: Joi.date()
    .less("now")
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
    .pattern(/(?![_.])[A-Za-z0-9._]+(?<![_.])/),
  bio: Joi.string().trim().max(300),
});

export const changeLoggedUserPassword = Joi.object({
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .required(),
});
