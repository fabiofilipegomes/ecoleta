import express from 'express';
import { celebrate, Joi } from 'celebrate';
import multer from 'multer';
import multerConfig from './config/multer';

import CollectPointController from './controllers/collect-point.controller';
import ItemController from './controllers/item.controller';

const routes = express.Router();
const upload = multer(multerConfig);

const collectPointController = new CollectPointController();
const itemController = new ItemController();

routes.get('/items', itemController.getAll);

// ------------- COLLECT POINTS ---------------
routes.get('/collectPoints/GetAll', collectPointController.getAll);
routes.get('/collectPoints/:id', collectPointController.getById);
routes.get('/collectPoints', collectPointController.get);
routes.post(
    '/collectPoints', 
    upload.single('image'),
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            whatsapp: Joi.string().required(),
            latitude: Joi.number().required(),
            city: Joi.string().required(),
            zipcode: Joi.string().required(),
            items: Joi.string().required(),
        })
    },{
        abortEarly: false
    }),
    collectPointController.create
);

export default routes;