import express from 'express';
import { changePassword, changeProfilePic, deleteMe, editMe, getMe } from '../controllers/me.controllers.js';
import { validate } from '../middlewares/validate.js';
import { changeLoggedUserPassword,editUserValidator } from '../validators/loggedUser.validator.js';
import { uploadProfilePic } from '../middlewares/uploadCloudinary.js';

const meRouter = express.Router();

meRouter.get('/', getMe);
meRouter.put('/', validate(editUserValidator, 'body'), editMe);
meRouter.patch('/password', validate(changeLoggedUserPassword, 'body'), changePassword);
meRouter.patch('/profile-pic', uploadProfilePic.single('profilePic'), changeProfilePic);
meRouter.delete('/', deleteMe);

export default meRouter;