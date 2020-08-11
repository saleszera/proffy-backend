import {Request, Response} from 'express'

import convertHourToMinutes from '../utils/convertHourToMinutes';
import db from '../database/connection';

class FilterClassesController{
  async index(req: Request, res: Response){
    const filters = req.query;

    const week_day = filters.week_day as string;
    const subject = filters.subject as string;
    const time = filters.time as string;
    
    let classes:any = [];

    if(week_day && !subject && !time){
      classes = await db('classes')
        .whereExists(function (){
          this.select('class_schedule.*')
          .from('class_schedule')
          .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
          .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])             
        })  
        .join('users', 'classes.user_id', '=', 'users.id')         
        .select(['users.*', 'classes.*']);
    }

    if(time && !subject && !week_day){

      classes = await db('classes')
        .whereExists(function (){
          this.select('class_schedule.*')
          .from('class_schedule')
          .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
          .whereRaw('`class_schedule`.`from` <= ??', [convertHourToMinutes(time)])
          .whereRaw('`class_schedule`.`to` > ??', [convertHourToMinutes(time)])   
        })  
        .join('users', 'classes.user_id', '=', 'users.id')         
        .select(['users.*', 'classes.*']);
    }

    if(subject && !time && !week_day){
      classes = await db('classes')   
        .where('classes.subject', '=', subject)
        .join('users', 'classes.user_id', '=', 'users.id')                                   
        .select(['classes.*', 'users.*']);
    }

    if(week_day && time && !subject){
      classes = await db('classes')
        .whereExists(function (){
          this.select('class_schedule.*')
          .from('class_schedule')
          .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
          .whereRaw('`class_schedule`.`from` <= ??', [convertHourToMinutes(time)])
          .whereRaw('`class_schedule`.`to` > ??', [convertHourToMinutes(time)])  
          .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])             
        })  
        .join('users', 'classes.user_id', '=', 'users.id')         
        .select(['users.*', 'classes.*']);
    }

    if(week_day && subject && !time){
      classes = await db('classes')
        .whereExists(function (){
          this.select('class_schedule.*')
          .from('class_schedule')
          .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')          
          .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])             
        })
        .where('classes.subject', '=', subject)
        .join('users', 'classes.user_id', '=', 'users.id')         
        .select(['users.*', 'classes.*']);
    }

    if(time && subject && !week_day){
      classes = await db('classes')
        .whereExists(function (){
          this.select('class_schedule.*')
          .from('class_schedule')
          .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
          .whereRaw('`class_schedule`.`from` <= ??', [convertHourToMinutes(time)])
          .whereRaw('`class_schedule`.`to` > ??', [convertHourToMinutes(time)])                      
        })
        .where('classes.subject', '=', subject)
        .join('users', 'classes.user_id', '=', 'users.id')         
        .select(['users.*', 'classes.*']);
    }

    if(time && subject && week_day){
      classes = await db('classes')
        .whereExists(function (){
          this.select('class_schedule.*')
          .from('class_schedule')
          .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
          .whereRaw('`class_schedule`.`from` <= ??', [convertHourToMinutes(time)])
          .whereRaw('`class_schedule`.`to` > ??', [convertHourToMinutes(time)])  
          .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])             
        })
        .where('classes.subject', '=', subject)  
        .join('users', 'classes.user_id', '=', 'users.id')         
        .select(['users.*', 'classes.*']);
    }

    if(!time && !subject  && !week_day){
      return res.status(400).json({Error: "Missing filters to search classes"})
    }

    return res.status(302).json(classes);  
  }
}

export default new FilterClassesController();