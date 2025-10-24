import express from 'express';
import { globalSearch } from '../controllers/search.controllers.js';

const searchRouter = express.Router();
searchRouter.get('/', globalSearch); 

export default searchRouter;