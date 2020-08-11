import express from 'express';
import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController';
import FilterClassesController from './controllers/FilterClassesController';

const routes = express.Router()
const classesController = new ClassesController();
const connectionsController = new ConnectionsController();

routes.get('/classes', classesController.index);
routes.post('/classes', classesController.create);

routes.get('/filer', FilterClassesController.index);

routes.get('/connections', connectionsController.index);
routes.post('/connections', connectionsController.create);



export default routes;