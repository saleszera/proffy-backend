import {Request, Response} from 'express';

import db from '../database/connection';

class ClassSchedulleController{
  async index(req: Request, res: Response){
    return res.json();
  }
}

export default new ClassSchedulleController();