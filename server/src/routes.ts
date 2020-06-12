import express from 'express';
import CollectPointController from './controllers/collect-point.controller';
import ItemController from './controllers/item.controller';

const routes = express.Router();
const collectPointController = new CollectPointController();
const itemController = new ItemController();

routes.get('/items', itemController.getAll);

// ------------- COLLECT POINTS ---------------
routes.get('/collectPoints/GetAll', collectPointController.getAll);
routes.get('/collectPoints/:id', collectPointController.getById);
routes.get('/collectPoints', collectPointController.get);
routes.post('/collectPoints', collectPointController.create);

export default routes;