/*
 *  Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>   
 *  This file (todoController.js) is part of LiteFarm.
 *  
 *  LiteFarm is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  LiteFarm is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details, see <https://www.gnu.org/licenses/>.
 */

const baseController = require('./baseController');
const sensorModel = require('../models/sensorModel');

const { transaction } = require('objection');
const { Model } = require('objection');
const uuidv4 = require('uuid/v4');

class sensorController extends baseController {
  static addSensor() {
    return async (req, res) => {
      const trx = await transaction.start(Model.knex());
      try {
        const id_column = sensorModel.idColumn;
        req.body[id_column] = uuidv4();
        const result = await baseController.postWithResponse(sensorModel, req.body, trx);
        await trx.commit();
        res.status(201).send(result);
      } 
      catch (error) {
        //handle more exceptions
        await trx.rollback();
        res.status(400).json({
          error,
        });
      }
    };
  }

  static getSensorbyID() {
    return async (req, res) => {
      try {
        const id = req.params.sensor_id;
        const row = await baseController.getIndividual(sensorModel, id);
        if (!row.length) {
          res.sendStatus(404)
        }
        else {
          res.status(200).send(row);
        }
      }
      catch (error) {
        //handle more exceptions
        res.status(400).json({
          error,
        });
      }
    };
  }

  static getAllSensorsinField(){
    return async (req, res) => {
      try {
        const for_id = req.params.field_id;
        const rows = await baseController.getByForeignKey(sensorModel, 'field_id', for_id);
        if (!rows.length) {
          res.sendStatus(404)
        }
        else {
          res.status(200).send(rows);
        }
      }
      catch (error) {
        //handle more exceptions
        res.status(400).json({
          error,
        });
      }
    }
  }

  static getAllSensorsinFarm(){
    return async (req, res) => {
      try {
        const for_id = req.params.farm_id;
        const rows = await baseController.getByForeignKey(sensorModel, 'farm_id', for_id);
        if (!rows.length) {
          res.sendStatus(404)
        }
        else {
          res.status(200).send(rows);
        }
      }
      catch (error) {
        //handle more exceptions
        res.status(400).json({
          error,
        });
      }
    }
  }

  static updateSensor(){
    return async (req, res) => {
      const trx = await transaction.start(Model.knex());
      try {
        const updated = await baseController.put(sensorModel, req.params.id, req.body, trx);
        await trx.commit();
        if (!updated.length) {
          res.sendStatus(404);
        }
        else {
          res.status(200).send(updated);
        }
      }
      catch (error) {
        await trx.rollback();
        res.status(400).json({
          error,
        });
      }
    }
  }

  static deleteSensor(){
    return async (req, res) => {
      const trx = await transaction.start(Model.knex());
      try {
        const isDeleted = await baseController.delete(sensorModel, req.params.id, trx);
        await trx.commit();
        if (isDeleted) {
          res.sendStatus(200);
        }
        else {
          res.sendStatus(404);
        }
      }
      catch (error) {
        await trx.rollback();
        res.status(400).json({
          error,
        });
      }
    }
  }
  
}
module.exports = sensorController;
